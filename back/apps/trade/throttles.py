"""
Custom throttle classes for the Trade API.

Scopes (rates are configured in settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']):
  - trade_burst    : short-window limit for POST /api/trades/ (expensive query)
  - trade_sustained: hour-window limit for POST /api/trades/
"""

from rest_framework.throttling import UserRateThrottle


class TradeBurstThrottle(UserRateThrottle):
    """
    Per-minute cap on the heavy trade query endpoint.
    Prevents a single user from hammering the DB with rapid filter changes.
    """

    scope = "trade_burst"


class TradeSustainedThrottle(UserRateThrottle):
    """
    Per-hour cap on the heavy trade query endpoint.
    Prevents sustained automated scraping within a single session.
    """

    scope = "trade_sustained"
