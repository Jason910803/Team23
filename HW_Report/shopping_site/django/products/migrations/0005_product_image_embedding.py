# Generated by Django 5.1.7 on 2025-05-24 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_remove_product_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image_embedding',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
