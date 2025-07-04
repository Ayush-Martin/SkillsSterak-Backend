/** Socket events for real-time communication */
export enum SocketEvents {
  // Connection events
  CONNECT = "connect",
  DISCONNECT = "disconnect",

  //Errors
  CONNECTION_ERROR = "error:connection",

  // Notification events
  NOTIFICATION_GET = "notifications:get",
  NOTIFICATION_NEW = "notifications:new",
  NOTIFICATION_MARK_READ = "notifications:markRead",
  NOTIFICATION_MARK_ALL_READ = "notifications:markAllRead",

  // Chat events
  CHAT_JOIN = "chat:new",
  CHAT_MESSAGE_SEND = "chat:newMessage_get",
  CHAT_MESSAGE_REACTION_SEND = "chat:newMessageReaction_get",
  CHAT_MESSAGE_BROADCAST = "chat:newMessage_emit",
  CHAT_MESSAGE_REACTION_BROADCAST = "chat:newMessageReaction_emit",
  CHAT_LAST_MESSAGE = "chat:lastMessage",

  // LiveChat events
  LIVE_CHAT_NEW_MESSAGE = "liveChat:newMessage",
}
