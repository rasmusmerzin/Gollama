import { ChatMessage } from "./ChatMessage";
import { uid } from "./uid";

export class Chat extends EventTarget {
  id = uid();
  title = "New Chat";
  model = "phi3:latest";
  messages = new Array<ChatMessage>();

  get last_message() {
    return this.messages[this.messages.length - 1];
  }

  static from({ id, title, model, messages }: Partial<Chat> = {}) {
    const chat = new Chat();
    if (id) chat.id = id;
    if (title) chat.title = title;
    if (model) chat.model = model;
    if (messages)
      for (const message of messages) chat.add(ChatMessage.from(message));
    return chat;
  }

  setTitle(title: string) {
    this.title = title;
    this.dispatchEvent(new Event("change"));
  }

  delete(message_id: string) {
    const index = this.messages.findIndex((msg) => msg.id === message_id);
    if (index === -1) return;
    this.messages.splice(index, 1);
    this.dispatchEvent(new CustomEvent("delete", { detail: message_id }));
    this.dispatchEvent(new Event("change"));
  }

  add(message: ChatMessage) {
    message.chat = this;
    this.messages.push(message);
    this.dispatchEvent(new Event("add"));
    this.dispatchEvent(new Event("change"));
  }
}
