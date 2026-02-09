from django.urls import path
from .views import CountryListAPIView, FlowListAPIView, TradeListView

urlpatterns = [
    path("trades/", TradeListView.as_view(), name="trade-list"),
    path("countries/", CountryListAPIView.as_view(), name="country-list"),
    path("flows/", FlowListAPIView.as_view(), name="flow-list"),
]
