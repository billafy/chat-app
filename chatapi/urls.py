from django.urls import path

import chatapi.viewsAccount as viewsAccount
import chatapi.viewsChat as viewsChat

urlpatterns = [
	path('account-api/', viewsAccount.accountApiOverview, name='Account API Overview'),
	path('account-list/', viewsAccount.accountListView, name='Account List'),
	path('account-search/<str:keyword>/', viewsAccount.accountSearchView, name='Account Search'),
	path('account-detailed/<str:username>/', viewsAccount.accountDetailedView, name='Account Detailed'),
	path('account-create/', viewsAccount.accountCreateView, name='Account Creation'),
	path('account-update/<str:username>/', viewsAccount.accountUpdateView, name='Account Updation'),
	path('account-delete/<str:username>/', viewsAccount.accountDeleteView, name='Account Deletion'),
	path('account-login/', viewsAccount.accountLoginView, name='Account Login'),
	path('password-update/<str:username>/', viewsAccount.passwordUpdateView, name='Password Update'),
	path('validate-email/', viewsAccount.validateEmailAddress, name='Email Validation'),
	
	path('get-friend-requests-sent/<str:username>/', viewsChat.getFriendRequestsSent, name='Friend Requests Sent List'),
	path('get-friend-requests-received/<str:username>/', viewsChat.getFriendRequestsReceived, name='Friend Requests Received List'),
	path('send-friend-request/', viewsChat.sendFriendRequest, name='Send Friend Request'),
	path('remove-friend-request/', viewsChat.removeFriendRequest, name='Remove Friend Request'),
	path('accept-friend-request/', viewsChat.acceptFriendRequest, name='Accept Friend Request'),
	path('get-friends/<str:username>/', viewsChat.getFriends, name='Get Friends'),
	path('remove-friend/', viewsChat.removeFriend, name='Remove As Friend'),
	path('get-messages/<str:user1>/<str:user2>/', viewsChat.getMessages, name='Get Messages'),
	path('send-message/', viewsChat.sendMessage, name='Send Message'),
	path('edit-message/<int:id>/', viewsChat.editMessage, name='Edit Message'),
	path('delete-message/<int:id>/', viewsChat.deleteMessage, name='Delete Message'),
]