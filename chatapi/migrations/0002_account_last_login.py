# Generated by Django 3.1.7 on 2021-03-13 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
    ]