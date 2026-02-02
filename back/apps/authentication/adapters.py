"""
Custom adapter for django-allauth Google OAuth provider.
"""

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()


class GoogleAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter for handling Google OAuth user creation and updates.
    """

    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a social provider,
        but before the login is actually processed.

        This allows us to link existing users by email.
        """
        if sociallogin.is_existing:
            return

        # Try to find existing user by email
        try:
            email = sociallogin.account.extra_data.get("email")
            if email:
                user = User.objects.get(email=email)
                sociallogin.connect(request, user)
        except User.DoesNotExist:
            pass

    def save_user(self, request, sociallogin, form=None):
        """
        Save user data from social provider.
        """
        user = super().save_user(request, sociallogin, form)

        # Extract Google-specific data
        extra_data = sociallogin.account.extra_data

        if not user.avatar and extra_data.get("picture"):
            user.avatar = extra_data.get("picture")

        if not user.google_id and extra_data.get("sub"):
            user.google_id = extra_data.get("sub")

        if not user.first_name and extra_data.get("given_name"):
            user.first_name = extra_data.get("given_name")

        if not user.last_name and extra_data.get("family_name"):
            user.last_name = extra_data.get("family_name")

        user.save()
        return user
