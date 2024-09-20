import { Chat } from "./Chat";

export class ChatStore extends EventTarget {
  static instance?: ChatStore;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ChatStore();
    this.instance.load();
    return this.instance;
  }

  chats = new Map<string, Chat>();

  add(chat: Chat) {
    this.chats.set(chat.id, chat);
    chat.save();
    this.save();
    this.dispatchEvent(new Event("change"));
  }

  delete(chat_id: string) {
    this.chats.get(chat_id)?.remove();
    this.chats.delete(chat_id);
    this.save();
    this.dispatchEvent(new Event("change"));
  }

  save() {
    const chat_ids = Array.from(this.chats.keys());
    const index = JSON.stringify(chat_ids);
    localStorage.setItem("chats", index);
  }

  load() {
    const index = localStorage.getItem("chats");
    if (!index) return;
    const chat_ids = JSON.parse(index);
    for (const chat_id of chat_ids) {
      const data = localStorage.getItem(chat_id);
      if (!data) return;
      try {
        const chat = Chat.from(JSON.parse(data));
        this.chats.set(chat.id, chat);
      } catch (error) {
        console.error(error);
        localStorage.removeItem(chat_id);
      }
    }
  }
}
