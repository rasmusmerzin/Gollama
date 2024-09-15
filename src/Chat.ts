import { ChatMessage } from "./ChatMessage";
import { uid } from "./uid";

export class Chat extends EventTarget {
  id = uid();
  title = "New Chat";
  model = "gemma2:2b";
  index = new Set<string>();
  messages = new Map<string, ChatMessage>();
  generating_title = false;

  static from({ id, title, model, index }: Partial<Chat> = {}) {
    const chat = new Chat();
    if (id) chat.id = id;
    if (title) chat.title = title;
    if (model) chat.model = model;
    if (index) chat.index = new Set(index);
    return chat;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      model: this.model,
      index: Array.from(this.index),
    };
  }

  get last_message() {
    const messages = Array.from(this.messages.values());
    return messages[messages.length - 1];
  }

  setTitle(title: string) {
    this.title = title;
    this.save();
    this.dispatchEvent(new Event("change"));
  }

  delete(message_id: string) {
    this.index.delete(message_id);
    this.messages.delete(message_id);
    localStorage.removeItem(message_id);
    this.save();
    this.dispatchEvent(new CustomEvent("delete", { detail: message_id }));
    this.dispatchEvent(new Event("change"));
  }

  add(message: ChatMessage) {
    message.chat = this;
    this.index.add(message.id);
    this.messages.set(message.id, message);
    message.save();
    this.save();
    this.dispatchEvent(new Event("add"));
    this.dispatchEvent(new Event("change"));
  }

  save() {
    const data = JSON.stringify(this);
    localStorage.setItem(this.id, data);
  }

  remove() {
    localStorage.removeItem(this.id);
    for (const id of this.index) localStorage.removeItem(id);
  }

  load() {
    for (const message_id of this.index) {
      if (this.messages.has(message_id)) continue;
      const data = localStorage.getItem(message_id);
      if (!data) continue;
      try {
        const message = ChatMessage.from(JSON.parse(data));
        this.messages.set(message.id, message);
      } catch (error) {
        console.error(error);
        localStorage.removeItem(message_id);
      }
    }
  }
}
