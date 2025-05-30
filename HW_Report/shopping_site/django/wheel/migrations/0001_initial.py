# Generated by Django 5.1.7 on 2025-05-25 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Prize",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("label", models.CharField(max_length=100, verbose_name="獎品名稱")),
                (
                    "color",
                    models.CharField(
                        default="#FFFFFF",
                        help_text="例如：#FF0000",
                        max_length=7,
                        verbose_name="顏色代碼",
                    ),
                ),
            ],
        ),
    ]
