from django.shortcuts import render
from django.db.models import Q
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from chatapi.models import FriendRequest, Friendship, Message
from chatapi.serializers import FriendRequestSerializer, FriendshipSerializer, MessageSerializer

from datetime import datetime

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getFriendRequestsSent(request, username) :
	if str(request.user) != username :
		return Response(False)
	friendRequests = FriendRequest.objects.filter(sender=username)
	serializer = FriendRequestSerializer(friendRequests, many=True)
	return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getFriendRequestsReceived(request, username) :
	if str(request.user) != username :
		return Response(False)
	friendRequests = FriendRequest.objects.filter(receiver=username)
	serializer = FriendRequestSerializer(friendRequests, many=True)
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def sendFriendRequest(request) :
	sender = request.data['sender']
	receiver = request.data['receiver']
	if str(request.user) != str(sender) :
		return Response(False)

	try :	
		friendRequest = FriendRequest.objects.get(sender=sender,receiver=receiver)
		return Response(False)
	except :
		pass

	serializer = FriendRequestSerializer(data=request.data)
	if serializer.is_valid() :
		serializer.save()

	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def removeFriendRequest(request) :
	sender = request.data['sender']
	receiver = request.data['receiver']
	if str(request.user) != str(sender) or str(request.user) != str(receiver) :
		return Response(False)
	try :
		friendRequest = FriendRequest.objects.get(sender=sender,receiver=receiver)
		friendRequest.delete()
	except :
		return Response(False)
	return Response(True)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request) :
	sender = request.data['sender']
	receiver = request.data['receiver']
	if str(request.user) != str(receiver) :
		return Response(False)

	try :
		friendRequest = FriendRequest.objects.get(sender=sender,receiver=receiver)
		friendRequest.delete()
		serializer = FriendshipSerializer(data={'user1':sender,'user2':receiver})
		if serializer.is_valid() :
			serializer.save()
		return Response(serializer.data)
	except :
		return Response(False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getFriends(request, username) :
	friends = Friendship.objects.filter(
			Q(user1=username) | Q(user2=username)
		).order_by('-lastMessaged')
	serializer = FriendshipSerializer(friends, many=True)
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def removeFriend(request) :
	user1 = request.data['user1']
	user2 = request.data['user2']
	try :
		friendship = Friendship.objects.get(
				Q(user1=user1,user2=user2) | Q(user1=user2,user2=user1) 
			)
		friendship.delete()
	except :
		return Response(False)
	return Response(True)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getMessages(request, username) :
	if str(request.user) != str(username):
		return Response(False)
	messages = Message.objects.filter(
			Q(sender=username) | Q(receiver=username)
		)
	serializer = MessageSerializer(messages, many=True)
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def sendMessage(request) :
	if str(request.user) != str(request.data['sender']):
		return Response(False)
	serializer = MessageSerializer(data=request.data)
	if serializer.is_valid() :
		serializer.save()
	friendship = Friendship.objects.get(
			Q(user1=request.data['sender'],user2=request.data['receiver']) |
			Q(user1=request.data['receiver'],user2=request.data['sender'])
		)
	friendship.lastMessaged = timezone.now()
	friendship.save()
	return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def editMessage(request, id) :
	message = Message.objects.get(id=id)
	if str(request.user) != str(message.sender) :
		return Response(False)
	message.text = request.data['text']
	message.save()
	serializer = MessageSerializer(message)
	return Response(serializer.data) 

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def deleteMessage(request, id) :
	message = Message.objects.get(id=id)
	if str(request.user) != str(message.sender) :
		return Response(False)
	message.delete()
	return Response(True)