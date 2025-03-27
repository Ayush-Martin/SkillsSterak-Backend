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
  CHAT_JOIN = "chat:new",
  CHAT_NEW_MESSAGE = "chat:newMessage",
}
