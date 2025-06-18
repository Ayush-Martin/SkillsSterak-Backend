export interface ChatHistory {
  role: "user" | "model";
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
