"""
Custom user model extending Django's AbstractUser.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with additional fields for OAuth authentication.

    Extends Django's AbstractUser with Google-specific fields.
    """

    email = models.EmailField(unique=True)
    avatar = models.URLField(
        blank=True, null=True, help_text="User's profile picture URL"
    )
    google_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Google OAuth unique identifier",
    )

    # Override username requirement - we'll use email as the primary identifier
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return user's full name."""
        return f"{self.first_name} {self.last_name}".strip() or self.email
