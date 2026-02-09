from django.db import models


class Trade(models.Model):
    id = models.AutoField(primary_key=True)
    hs_chapter_code = models.TextField()
    hs_chapter_label = models.TextField()
    hs_product_code = models.TextField()
    hs_product_label = models.TextField()

    usage_group_code = models.TextField()
    usage_group_label = models.TextField()

    remarkable_product_code = models.TextField()
    remarkable_product_label = models.TextField()

    ctci_section_code = models.TextField()
    ctci_section_label = models.TextField()
    ctci_division_code = models.TextField()
    ctci_division_label = models.TextField()
    ctci_group_code = models.TextField()
    ctci_group_label = models.TextField()

    continent = models.TextField()
    country_code = models.TextField()
    country_name = models.TextField()

    flow_code = models.TextField()
    flow_label = models.TextField()

    weight_kg = models.DecimalField(max_digits=20, decimal_places=3, null=True)
    value_dhs = models.DecimalField(max_digits=20, decimal_places=2, null=True)
    supplementary_unit = models.DecimalField(max_digits=20, decimal_places=2, null=True)

    date = models.DateField()

    class Meta:
        db_table = "trade_stats"
        managed = False


class ProcessedFile(models.Model):
    filename = models.TextField(primary_key=True)
    processed_at = models.DateTimeField()

    class Meta:
        db_table = "processed_files"
        managed = False


class Country(models.Model):
    country_name = models.CharField(max_length=255)
    country_code = models.CharField(max_length=10, unique=True)

    class Meta:
        db_table = "countries"
        managed = False
        ordering = ["country_name"]

    def __str__(self):
        return self.country_name


class Flow(models.Model):
    flow_label = models.CharField(max_length=255)
    flow_code = models.CharField(max_length=10, unique=True)

    class Meta:
        db_table = "flows"
        managed = False
        ordering = ["flow_label"]

    def __str__(self):
        return self.flow_label
