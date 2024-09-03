export class ChatMessage extends EventTarget {
  role: "user" | "assistant" = "user";
  content = "";

  static from({ role, content }: Partial<ChatMessage> = {}) {
    const message = new ChatMessage();
    if (role) message.role = role;
    if (content) message.content = content;
    return message;
  }
}
