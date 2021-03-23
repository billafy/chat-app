# Generated by Django 3.1.7 on 2021-03-13 09:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chatapi', '0002_account_last_login'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='date_joined',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='account',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='account',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='account',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='account',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='account',
            name='last_login',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='account',
            name='username',
            field=models.CharField(max_length=32, unique=True),
        ),
    ]
