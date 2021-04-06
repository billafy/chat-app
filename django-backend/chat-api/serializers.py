from rest_framework import serializers
from chatapi.models import Account, FriendRequest, Friendship, Message
from rest_framework.authtoken.models import Token

class AccountSerializer(serializers.ModelSerializer) :
	class Meta :
		model = Account
		fields = '__all__'

class TokenSerializer(serializers.ModelSerializer) :
	class Meta :
		model = Token
		fields = ['key']

class FriendRequestSerializer(serializers.ModelSerializer) :
	class Meta :
		model = FriendRequest
		fields = '__all__'

class FriendshipSerializer(serializers.ModelSerializer) :
	class Meta :
		model = Friendship
		fields = '__all__'

class MessageSerializer(serializers.ModelSerializer) :
	class Meta :
		model = Message
		fields = '__all__'