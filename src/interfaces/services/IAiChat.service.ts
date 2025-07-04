/**
 * Represents a single message in the AI chat history.
 * Used to maintain conversational context for course-related AI interactions.
 */
export interface ChatHistory {
  /** The sender of the message: user or AI model */
  role: "user" | "model";
  /** The message content, supporting multi-part text for extensibility */
  parts: [{ text: string }];
}

export interface IAiChatService {
  /** Retrieves course outline data by course ID */
  courseChatHandler(
    courseId: string,
    message: string,
    history: ChatHistory[]
  ): Promise<string | null>;
}
