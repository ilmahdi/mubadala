"""
Trade data models using star schema design.

Star Schema Structure:
- TradeFact: Central fact table with metrics and foreign keys to dimensions
- 6 Dimension tables: HsProduct, UsageGroup, RemarkableProduct, Ctci, Country, Flow

All models are unmanaged (managed=False) as the database is populated by external ETL scripts.
"""

from django.db import models

# ============================================================================
# DIMENSION TABLES
# ============================================================================


class HsProduct(models.Model):
    """HS Product Classification dimension."""

    hs_product_code = models.TextField(primary_key=True)
    hs_product_label = models.TextField(blank=True, null=True)
    hs_chapter_code = models.TextField(blank=True, null=True)
    hs_chapter_label = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_hs_product"
        managed = False
        ordering = ["hs_product_code"]
        indexes = [
            models.Index(fields=["hs_product_code"]),
            models.Index(fields=["hs_chapter_code"]),
        ]

    def __str__(self):
        return f"{self.hs_product_code} - {self.hs_product_label or 'N/A'}"


class UsageGroup(models.Model):
    """Usage Group dimension."""

    usage_group_code = models.TextField(primary_key=True)
    usage_group_label = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_usage_group"
        managed = False
        ordering = ["usage_group_code"]

    def __str__(self):
        return f"{self.usage_group_code} - {self.usage_group_label or 'N/A'}"


class RemarkableProduct(models.Model):
    """Remarkable Product dimension."""

    remarkable_product_code = models.TextField(primary_key=True)
    remarkable_product_label = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_remarkable_product"
        managed = False
        ordering = ["remarkable_product_code"]

    def __str__(self):
        return (
            f"{self.remarkable_product_code} - {self.remarkable_product_label or 'N/A'}"
        )


class Ctci(models.Model):
    """CTCI Classification dimension."""

    ctci_group_code = models.TextField(primary_key=True)
    ctci_group_label = models.TextField(blank=True, null=True)
    ctci_division_code = models.TextField(blank=True, null=True)
    ctci_division_label = models.TextField(blank=True, null=True)
    ctci_section_code = models.TextField(blank=True, null=True)
    ctci_section_label = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_ctci"
        managed = False
        ordering = ["ctci_group_code"]
        indexes = [
            models.Index(fields=["ctci_group_code"]),
            models.Index(fields=["ctci_division_code"]),
            models.Index(fields=["ctci_section_code"]),
        ]

    def __str__(self):
        return f"{self.ctci_group_code} - {self.ctci_group_label or 'N/A'}"


class Country(models.Model):
    """Country dimension."""

    country_code = models.TextField(primary_key=True)
    country_name = models.TextField(blank=True, null=True)
    continent = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_country"
        managed = False
        ordering = ["country_name"]
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.country_name or self.country_code}"


class Flow(models.Model):
    """Flow direction dimension (Import/Export)."""

    flow_code = models.TextField(primary_key=True)
    flow_label = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "dim_flow"
        managed = False
        ordering = ["flow_label"]

    def __str__(self):
        return f"{self.flow_label or self.flow_code}"


# ============================================================================
# FACT TABLE
# ============================================================================


class TradeFact(models.Model):
    """
    Central fact table for trade transactions.

    Contains metrics (weight, value, units) and foreign keys to dimension tables.
    Uses select_related() in views to prevent N+1 queries.
    """

    id = models.BigAutoField(primary_key=True)

    # Foreign keys to dimension tables
    hs_product = models.ForeignKey(
        HsProduct,
        on_delete=models.DO_NOTHING,
        db_column="hs_product_code",
        to_field="hs_product_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    usage_group = models.ForeignKey(
        UsageGroup,
        on_delete=models.DO_NOTHING,
        db_column="usage_group_code",
        to_field="usage_group_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    remarkable_product = models.ForeignKey(
        RemarkableProduct,
        on_delete=models.DO_NOTHING,
        db_column="remarkable_product_code",
        to_field="remarkable_product_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    ctci = models.ForeignKey(
        Ctci,
        on_delete=models.DO_NOTHING,
        db_column="ctci_group_code",
        to_field="ctci_group_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.DO_NOTHING,
        db_column="country_code",
        to_field="country_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    flow = models.ForeignKey(
        Flow,
        on_delete=models.DO_NOTHING,
        db_column="flow_code",
        to_field="flow_code",
        related_name="trade_facts",
        blank=True,
        null=True,
    )

    # Metrics
    weight_kg = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True
    )
    value_dhs = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True
    )
    supplementary_unit = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True
    )

    # Time dimension
    trade_date = models.DateField(db_index=True)

    class Meta:
        db_table = "trade_fact"
        managed = False
        ordering = ["-trade_date"]
        indexes = [
            models.Index(fields=["trade_date"]),
            models.Index(fields=["value_dhs"]),
            models.Index(fields=["weight_kg"]),
            # Foreign key indexes are auto-created by PostgreSQL
        ]

    def __str__(self):
        return f"Trade {self.id} - {self.trade_date}"


# ============================================================================
# LEGACY / UTILITY MODELS
# ============================================================================


class ProcessedFile(models.Model):
    """Tracks ETL processed files."""

    filename = models.TextField(primary_key=True)
    processed_at = models.DateTimeField()

    class Meta:
        db_table = "processed_files"
        managed = False
        ordering = ["-processed_at"]

    def __str__(self):
        return f"{self.filename} ({self.processed_at})"


class QueryCountCache(models.Model):
    query_hash = models.CharField(max_length=64, unique=True)
    count = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "query_count_cache"
