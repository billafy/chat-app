from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.db.models import Q

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework.authtoken.models import Token

from asgiref.sync import sync_to_async

from chatapi.models import Account, FriendRequest, Friendship, Message
from chatapi.serializers import AccountSerializer, TokenSerializer

from validate_email import validate_email

# account API

@sync_to_async
@api_view(['GET'])
@permission_classes([AllowAny])
def accountApiOverview(request) :
	chatApiUrls = {
		'Account List' : '/account-list/',
		'Account Detailed' : '/<str:username>/account-detailed/',
		'Create Account' : '/account-create/',
		'Update Account' : '/<str:username>/account-update/',
		'Delete Account' : '/<str:username>/account-delete/',
		'Login Account' : '/account-login/',
	}
	return Response(chatApiUrls)

@sync_to_async
@api_view(['GET']) 
@permission_classes([AllowAny])
def accountListView(request) :
	accounts = Account.objects.all()
	serializer = AccountSerializer(accounts, many=True)
	return Response(serializer.data)

@sync_to_async
@api_view(['GET']) 
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def accountSearchView(request, keyword) :
	accounts = Account.objects.filter(username__istartswith=keyword).exclude(username=str(request.user))
	serializer = AccountSerializer(accounts, many=True)
	return Response(serializer.data)

@sync_to_async
@api_view(['GET']) 
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def accountDetailedView(request, username) :
	try :
		account = Account.objects.get(username=username)
	except :
		return Response(False)
	serializer = AccountSerializer(account)
	return Response(serializer.data)

@sync_to_async
@api_view(['POST']) 
@permission_classes([AllowAny])
def accountCreateView(request) :
	serializer = AccountSerializer(data=request.data)
	if serializer.is_valid() :
		serializer.save()
		User.objects.create_user(
				username=request.data['username'],
				password=request.data['password']
			)
	else :
		return Response(False)
	user = User.objects.get(username=request.data['username'])
	token = Token.objects.get(user=user)
	serializer = TokenSerializer(token)
	return Response(serializer.data['key'])

@sync_to_async
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST']) 
def accountUpdateView(request, username) :
	if str(request.user) != str(username) :
		return Response('NOT ALLOWED')
	try :
		account = Account.objects.get(username=username)
	except :
		return Response(False)
	serializer = AccountSerializer(instance=account, data=request.data)
	if serializer.is_valid() :
		user = User.objects.get(username=username)
		user.delete()
		User.objects.create_user(
				username=request.data['username'],
				password=request.data['password']
			)
		serializer.save()
	else :
		return Response(False)
	return Response(True)

@sync_to_async
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET']) 
def accountDeleteView(request, username) :
	if str(request.user) != str(username) :
		print('NOT ALLOWED')
		return Response('NOT ALLOWED')
	try :
		account = Account.objects.get(username=username)
	except :
		print('Account unablable')
		return Response(False)
	user = User.objects.get(username=username)
	FriendRequest.objects.filter(
			Q(sender=username) | Q(receiver=username)
		).delete()
	Friendship.objects.filter(
			Q(user1=username) | Q(user2=username)
		).delete()
	Message.objects.filter(
			Q(sender=username) | Q(receiver=username)
		).delete()
	user.delete()
	account.delete()
	print('done bro')
	return Response(True)

@sync_to_async
@api_view(['POST']) 
@permission_classes([AllowAny])
def accountLoginView(request) :
	username = request.data['username']
	password = request.data['password']
	try :
		user = User.objects.get(
				username=username
			)
		if not check_password(password, user.password) :
			return Response(False)
	except :
		return Response(False)
	token = Token.objects.get(user=user)
	serializer = TokenSerializer(token)
	return Response(serializer.data['key'])

@sync_to_async
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def passwordUpdateView(request, username) :
	oldPassword = request.data['oldPassword']
	newPassword = request.data['newPassword']
	if str(request.user) != str(username) :
		return Response('NOT ALLOWED')
	try :
		user = User.objects.get(username=username)
		if not check_password(oldPassword, user.password) :
			return Response(False)
		user.delete()
		user = User.objects.create_user(username=username, password=newPassword)
		token = Token.objects.get(user=user)
		serializer = TokenSerializer(token)
	except :
		return Response(False)
	return Response(serializer.data['key'])

@sync_to_async
@api_view(['POST'])
@permission_classes([AllowAny])
def validateEmailAddress(request) :
	isValid = validate_email(email_address=request.data['email'])
	if isValid is None :
		isValid = True
	return Response(isValid)

 

