"""
Authentication views and endpoints.
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer

User = get_user_model()
logger = logging.getLogger(__name__)


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
    Verify JWT token validity.

    GET /api/auth/verify/ - Verify current token
    """
    return Response({"valid": True, "user": UserSerializer(request.user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def sync_google_user(request):
    """
    Sync Google OAuth user with Django backend.

    POST /api/auth/sync-google-user/ - Create or update user from Google profile

    Request body:
    {
        "email": "user@example.com",
        "name": "John Doe",
        "google_id": "123456789",
        "picture": "https://..."
    }
    """
    email = request.data.get("email")
    google_id = request.data.get("google_id")
    name = request.data.get("name", "")
    picture = request.data.get("picture", "")

    if not email or not google_id:
        logger.warning(f"Sync failed: Missing email or google_id")
        return Response(
            {"error": "Email and google_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Parse first and last name
    name_parts = name.split(" ", 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    # Create or update user
    user, created = User.objects.update_or_create(
        email=email,
        defaults={
            "google_id": google_id,
            "first_name": first_name,
            "last_name": last_name,
            "avatar": picture,
            "username": email.split("@")[0],  # Use email prefix as username
            "is_active": True,
        },
    )

    action = "created" if created else "updated"
    logger.info(f"User {action}: {email} (ID: {user.id})")

    serializer = UserSerializer(user)
    return Response(
        {"user": serializer.data, "created": created, "message": f"User {action}"},
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
