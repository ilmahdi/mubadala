"""Trade API pagination."""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class TradePagination(PageNumberPagination):
    page_size = 10
    page_size_key = "page_size"
    page = "page"
    max_page_size = 200

    def get_page_number(self, request, paginator):
        if request.method == "POST":
            page_number = request.data.get(self.page)
            if page_number:
                return page_number
            return 1
        return super().get_page_number(request, paginator)

    def get_page_size(self, request):
        if request.method == "POST":
            page_size = request.data.get(self.page_size_key)
            if page_size:
                try:
                    page_size = int(page_size)
                    return min(page_size, self.max_page_size)
                except (TypeError, ValueError):
                    return self.page_size
            return self.page_size
        return super().get_page_size(request)
