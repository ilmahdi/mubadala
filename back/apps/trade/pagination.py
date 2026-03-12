import time
import hashlib
from django.core.paginator import Paginator
from django.db import connection
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from .models import QueryCountCache


class CachedCountPaginator(Paginator):

    CACHE_TTL_SECONDS = 3600 * 24 * 30 * 4
    CACHE_MIN_QUERY_SECONDS = 0.2
    COUNT_TIMEOUT_MS = 700
    SAMPLE_PCT = 2.0

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cached_count = None
        self._count_tier: int | None = None

    def _get_query_hash(self, queryset) -> str:
        sql, params = queryset.order_by().values("id").query.sql_with_params()
        return hashlib.sha256((sql + str(params)).encode()).hexdigest()

    def _get_cached_count(self, query_hash: str) -> tuple[int, int] | None:
        entry = QueryCountCache.objects.filter(query_hash=query_hash).first()
        if entry is None:
            return None

        age = (timezone.now() - entry.created_at).total_seconds()
        if age < self.CACHE_TTL_SECONDS:
            return entry.count, entry.tier

        return None

    @property
    def count_method(self) -> str:
        tier_map = {
            QueryCountCache.Tier.EXACT: "exact",
            QueryCountCache.Tier.APPROXIMATE: "approximate",
            QueryCountCache.Tier.FALLBACK: "fallback",
        }
        return tier_map.get(self._count_tier, "exact")

    def _store_cached_count(self, query_hash: str, count: int, tier: int) -> None:
        QueryCountCache.objects.bulk_create(
            [QueryCountCache(query_hash=query_hash, count=count, tier=tier)],
            update_conflicts=True,
            unique_fields=["query_hash"],
            update_fields=["count", "tier"],
        )

    def _get_exact_count_with_timeout(self, queryset) -> tuple[int, float] | None:
        try:
            with transaction.atomic():
                start = time.monotonic()
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SET LOCAL statement_timeout = %s", [self.COUNT_TIMEOUT_MS]
                    )
                result = queryset.order_by().count()
                elapsed = time.monotonic() - start
                return result, elapsed

        except Exception:
            return None, 0.0

    def _get_approximate_count(self, queryset) -> int | None:

        inner_sql, params = queryset.order_by().values("id").query.sql_with_params()
        table_name = queryset.model._meta.db_table

        from_token = f'FROM "{table_name}"'

        sampled_sql = inner_sql.replace(
            from_token,
            f"{from_token} TABLESAMPLE SYSTEM({self.SAMPLE_PCT})",
            1,
        )

        try:
            with connection.cursor() as cursor:

                cursor.execute(
                    f"SELECT COUNT(*) FROM ({sampled_sql}) _tablesample_estimate",
                    params,
                )

                row = cursor.fetchone()

                if row and row[0] is not None:
                    return int(row[0] / (self.SAMPLE_PCT / 100))

        except Exception:
            pass

        return None

    @property
    def count(self) -> int:
        if self._cached_count is not None:
            return self._cached_count

        queryset = self.object_list
        query_hash = self._get_query_hash(queryset)

        # Tier 1: cached
        cached = self._get_cached_count(query_hash)
        if cached is not None:
            count, tier = cached
            self._cached_count = count
            self._count_tier = tier
            return count

        # Tier 2: exact with timeout
        exact, elapsed = self._get_exact_count_with_timeout(queryset)
        if exact is not None:
            self._count_tier = QueryCountCache.Tier.EXACT
            if elapsed > self.CACHE_MIN_QUERY_SECONDS:
                self._store_cached_count(
                    query_hash, exact, tier=QueryCountCache.Tier.EXACT
                )
            self._cached_count = exact
            return exact

        # Tier 3: approximate fallback
        approx = self._get_approximate_count(queryset)
        if approx is not None:
            self._count_tier = QueryCountCache.Tier.APPROXIMATE
            self._cached_count = approx
            self._store_cached_count(
                query_hash, approx, tier=QueryCountCache.Tier.APPROXIMATE
            )
            return approx

        # Tier 4: final fallback
        exact = super().count
        self._count_tier = QueryCountCache.Tier.FALLBACK
        self._store_cached_count(query_hash, exact, tier=QueryCountCache.Tier.FALLBACK)
        self._cached_count = exact
        return exact


class TradePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 50

    django_paginator_class = CachedCountPaginator

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        if self.page is not None:
            response.data["count_method"] = self.page.paginator.count_method
        return response

    def get_page_number(self, request, paginator):
        if hasattr(request, "data"):
            return request.data.get("page", 1)

        return super().get_page_number(request, paginator)

    def get_page_size(self, request):
        if hasattr(request, "data"):
            return min(
                request.data.get("page_size", self.page_size),
                self.max_page_size,
            )

        return super().get_page_size(request)
