# Generated by Django 5.1.7 on 2025-05-21 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_rename_user_myuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='name',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]
