from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class Account(models.Model) :
	class Gender(models.TextChoices) :
		MALE = 'M'
		FEMALE = 'F'
		OTHER = 'O'
	
	username = models.CharField(max_length=32, unique=True, primary_key=True)
	email = models.EmailField(max_length=100, unique=True)
	dateOfBirth = models.DateField()
	gender = models.CharField(max_length=1,choices=Gender.choices)
	accountCreated = models.DateTimeField(auto_now_add=True)
	isOnline = models.BooleanField(default=False)

	def __str__(self) :
		return self.username

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs) :
	if created :
		Token.objects.create(user=instance)

class FriendRequest(models.Model) :
	sender = models.CharField(max_length=32)
	receiver = models.CharField(max_length=32)
	requestSentAt = models.DateTimeField(auto_now_add=True)

	def __str__(self) :
		return self.sender + '->' + self.receiver

class Friendship(models.Model) :
	user1 = models.CharField(max_length=32)
	user2 = models.CharField(max_length=32)
	lastMessaged = models.DateTimeField(auto_now_add=True)

	def __str__(self) :
		return self.user1 + '<->' + self.user2

class Message(models.Model) :
	text = models.TextField()
	messageDateTime = models.DateTimeField(auto_now_add=True)
	sender = models.CharField(max_length=32)
	receiver = models.CharField(max_length=32)
	friendshipId = models.IntegerField()
	read = models.BooleanField(default=False)
