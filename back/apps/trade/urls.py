from django.urls import path
from .views import TradeListView

urlpatterns = [
    path("trades/", TradeListView.as_view(), name="trade-list"),
]
