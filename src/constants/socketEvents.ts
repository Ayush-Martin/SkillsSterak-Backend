export enum SocketEvents {
  // Connection events
  CONNECT = "connect",
  DISCONNECT = "disconnect",

  // Notification events
  NOTIFICATION_GET = "notifications:get",
  NOTIFICATION_NEW = "notifications:new",
  NOTIFICATION_MARK_READ = "notifications:markRead",
  NOTIFICATION_MARK_ALL_READ = "notifications:markAllRead",

  // Chat events
  CHAT_JOIN = "chat:join",
  CHAT_LEAVE = "chat:leave",
  CHAT_MESSAGE = "chat:message",
  CHAT_NEW_MESSAGE = "chat:newMessage",
  CHAT_TYPING = "chat:typing",
  CHAT_USER_TYPING = "chat:userTyping",
  CHAT_MARK_READ = "chat:markRead",
  CHAT_SEEN = "chat:seen",
  CHAT_GET_HISTORY = "chat:getHistory",
  CHAT_GET_CONVERSATIONS = "chat:getConversations",
}
