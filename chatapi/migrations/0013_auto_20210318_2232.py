# Generated by Django 3.1.7 on 2021-03-18 17:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatapi', '0012_auto_20210314_2317'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user1', models.CharField(max_length=32)),
                ('user2', models.CharField(max_length=32)),
                ('lastMessaged', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sender', models.CharField(max_length=32)),
                ('receiver', models.CharField(max_length=32)),
                ('requestSentAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(max_length=100, unique=True),
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('messageDateTime', models.DateTimeField(auto_now_add=True)),
                ('sender', models.CharField(max_length=32)),
                ('receiver', models.CharField(max_length=32)),
                ('conversationId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chatapi.conversation')),
            ],
        ),
    ]
