"""
Dimension serializers — lightweight read-only serializers for the lookup endpoints.

GET /api/countries/  →  CountrySerializer
GET /api/flows/      →  FlowSerializer
"""

from rest_framework import serializers

from ..models import Country, Flow


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for the Country dimension."""

    class Meta:
        model = Country
        fields = ["country_code", "country_name"]


class FlowSerializer(serializers.ModelSerializer):
    """Serializer for the Flow dimension (Import / Export)."""

    class Meta:
        model = Flow
        fields = ["flow_code", "flow_label"]
