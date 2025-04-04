export interface ChatHistory {
  role: "user" | "model";
  parts: [{ text: string }];
}

export interface IAiChatService {
  courseChatHandler(
    courseId: string,
    message: string,
    history: ChatHistory[]
  ): Promise<string | null>;
}
