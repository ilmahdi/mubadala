import hashlib
from django.core.paginator import Paginator
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination

from .models import QueryCountCache


class CachedCountPaginator(Paginator):

    CACHE_TTL_SECONDS = 3600 * 24 * 30 * 4

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cached_count = None

    def _get_query_hash(self, queryset):
        sql = str(queryset.order_by().query)
        return hashlib.sha256(sql.encode()).hexdigest()

    def _get_cached_count(self, query_hash):
        try:
            entry = QueryCountCache.objects.get(query_hash=query_hash)

            age = (timezone.now() - entry.created_at).total_seconds()
            if age < self.CACHE_TTL_SECONDS:
                return entry.count

            # expired → delete
            entry.delete()

        except QueryCountCache.DoesNotExist:
            pass

        return None

    def _store_cached_count(self, query_hash, count):
        QueryCountCache.objects.update_or_create(
            query_hash=query_hash,
            defaults={
                "count": count,
                "created_at": timezone.now(),
            },
        )

    @property
    def count(self):
        if self._cached_count is not None:
            return self._cached_count

        queryset = self.object_list
        query_hash = self._get_query_hash(queryset)

        # Try DB cache first
        cached = self._get_cached_count(query_hash)
        if cached is not None:
            self._cached_count = cached
            return cached

        # Run expensive COUNT(*)
        exact = super().count

        # Store result
        self._store_cached_count(query_hash, exact)

        self._cached_count = exact
        return exact


class TradePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 50

    django_paginator_class = CachedCountPaginator

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
