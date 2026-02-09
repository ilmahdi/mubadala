from rest_framework import serializers
from .models import Country, Flow, Trade


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if not request:
            return

        fields_param = request.query_params.get("fields")
        if not fields_param:
            return

        allowed = set(fields_param.split(","))
        existing = set(self.fields.keys())

        for field_name in existing - allowed:
            self.fields.pop(field_name)


class TradeSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Trade
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["country_name", "country_code"]


class FlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flow
        fields = ["flow_label", "flow_code"]
