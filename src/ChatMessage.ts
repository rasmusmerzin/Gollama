import { Chat } from "./Chat";
import { uid } from "./uid";

export class ChatMessage extends EventTarget {
  id = uid();
  role: "user" | "assistant" = "user";
  content = "";
  loading = false;
  chat: Chat | null = null;

  static from({ id, role, content }: Partial<ChatMessage> = {}) {
    const message = new ChatMessage();
    if (id) message.id = id;
    if (role) message.role = role;
    if (content) message.content = content;
    return message;
  }

  toJSON() {
    return { id: this.id, role: this.role, content: this.content };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }

  pushContent(content: string) {
    this.content += content;
    this.save();
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }

  save() {
    const data = JSON.stringify(this);
    localStorage.setItem(this.id, data);
  }
}
