# Generated by Django 3.1.7 on 2021-03-13 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapi', '0005_auto_20210313_1542'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]
