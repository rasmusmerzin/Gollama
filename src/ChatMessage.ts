import { Chat } from "./Chat";
import { uid } from "./uid";

export class ChatMessage extends EventTarget {
  id = uid();
  role: "user" | "assistant" = "user";
  content = "";
  loading = false;
  chat: Chat | null = null;

  static from({ role, content }: Partial<ChatMessage> = {}) {
    const message = new ChatMessage();
    if (role) message.role = role;
    if (content) message.content = content;
    return message;
  }

  toJSON() {
    return { role: this.role, content: this.content };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }

  pushContent(content: string) {
    this.content += content;
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }
}
