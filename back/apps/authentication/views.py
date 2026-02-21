"""
Authentication views and endpoints.
"""

import logging
import os
import secrets
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserProfileSerializer

User = get_user_model()
logger = logging.getLogger(__name__)


def _verify_internal_secret(request) -> bool:
    """
    Verify the shared internal secret used to authenticate server-to-server
    calls from the Next.js backend to this endpoint.

    The secret must be passed via the X-Internal-Secret header and must match
    the INTERNAL_API_SECRET environment variable.
    """
    expected = os.getenv("INTERNAL_API_SECRET", "")
    if not expected:
        logger.error("INTERNAL_API_SECRET is not set — rejecting internal request")
        return False
    provided = request.headers.get("X-Internal-Secret", "")
    # Use constant-time comparison to prevent timing attacks
    return secrets.compare_digest(expected, provided)


class UserProfileView(APIView):
    """
    API endpoint for retrieving and updating authenticated user's profile.

    GET /api/auth/profile/ - Get current user profile
    PATCH /api/auth/profile/ - Update current user profile
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get authenticated user's profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """Update authenticated user's profile."""
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """
    Verify Django JWT token validity.

    GET /api/auth/verify/ - Verify current token
    """
    return Response({"valid": True, "user": UserSerializer(request.user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def sync_google_user(request):
    """
    Sync Google OAuth user with Django backend and return Django JWT tokens.

    This endpoint is intended for **server-to-server** calls only (Next.js
    signIn callback → Django).  It is protected by a shared secret sent in
    the X-Internal-Secret header — do NOT expose it to browser clients.

    POST /api/auth/sync-google-user/

    Request body:
    {
        "email": "user@example.com",
        "name": "John Doe",
        "google_id": "123456789",
        "picture": "https://..."
    }

    Response:
    {
        "access": "<django-jwt-access-token>",
        "refresh": "<django-jwt-refresh-token>",
        "user": { ... },
        "created": true
    }
    """
    # --- Authentication: verify shared internal secret ---
    if not _verify_internal_secret(request):
        logger.warning(
            "Rejected sync-google-user call: invalid or missing X-Internal-Secret"
        )
        return Response(
            {"error": "Forbidden"},
            status=status.HTTP_403_FORBIDDEN,
        )

    email = request.data.get("email")
    google_id = request.data.get("google_id")
    name = request.data.get("name", "")
    picture = request.data.get("picture", "")

    if not email or not google_id:
        logger.warning("Sync failed: Missing email or google_id")
        return Response(
            {"error": "email and google_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Parse first and last name
    name_parts = name.split(" ", 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    # Derive a collision-safe username: prefer email-prefix, fall back to
    # appending the first 8 chars of google_id when a conflict exists.
    base_username = email.split("@")[0]
    username = base_username
    if User.objects.filter(username=username).exclude(email=email).exists():
        username = f"{base_username}_{google_id[:8]}"

    # Create or update user
    user, created = User.objects.update_or_create(
        email=email,
        defaults={
            "google_id": google_id,
            "first_name": first_name,
            "last_name": last_name,
            "avatar": picture,
            "username": username,
            "is_active": True,
        },
    )

    action = "created" if created else "updated"
    logger.info("User %s: %s (ID: %s)", action, email, user.id)

    # Issue Django JWT tokens for this user
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
            "created": created,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint.

    GET /api/auth/health/ - Check authentication service health
    """
    return Response({"status": "ok", "service": "authentication"})
