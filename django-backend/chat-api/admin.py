from django.contrib import admin

from chatapi.models import Account, FriendRequest, Friendship, Message

# Register your models here.

admin.site.register(Account)
admin.site.register(FriendRequest)
admin.site.register(Friendship)

admin.site.register(Message)
