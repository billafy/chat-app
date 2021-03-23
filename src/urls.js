const prefix = 'http://127.0.0.1:8000/chat-api/';

export const urls = {
	accountList: prefix+'account-list/',
	accountSearch: prefix+'account-search/',
	accountDetailed: prefix+'account-detailed/',
	accountCreate: prefix+'account-create/',
	accountUpdate: prefix+'account-update/',
	accountDelete: prefix+'account-delete/',
	accountLogin: prefix+'account-login/',
	passwordUpdate: prefix+'password-update/',
	validateEmail: prefix+'validateEmail/',
	getFriendRequestsSent: prefix+'get-friend-requests-sent/',
	getFriendRequestsReceived: prefix+'get-friend-requests-received/',
	sendFriendRequest: prefix+'send-friend-request/',
	removeFriendRequest: prefix+'remove-friend-request/',
	acceptFriendRequest: prefix+'acceptFriendRequest/',
	getFriends: prefix+'get-friends/',
	removeFriend: prefix+'remove-friend/',
	getMessages: prefix+'get-messages/',
	sendMessage: prefix+'send-message/',
	editMessage: prefix+'edit-message/',
	deletedMessage: prefix+'delete-message/',
};