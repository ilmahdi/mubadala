"""
URL configuration for authentication endpoints.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = "authentication"

urlpatterns = [
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("verify/", views.verify_token, name="verify"),
    path("sync-google-user/", views.sync_google_user, name="sync-google-user"),
    path("health/", views.health_check, name="health"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
