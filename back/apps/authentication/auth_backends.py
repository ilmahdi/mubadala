from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


class CachedJWTAuthentication(JWTAuthentication):
    """Used by API auth (Bearer token)"""

    def get_user(self, validated_token):
        user_id = validated_token["user_id"]
        cache_key = f"user:{user_id}"
        user = cache.get(cache_key)
        if user is None:
            user = super().get_user(validated_token)
            if user is not None:
                cache.set(cache_key, user, timeout=300)
        return user
