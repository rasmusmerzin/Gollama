import { Chat } from "./Chat";

export class ChatStore extends EventTarget {
  static instance: ChatStore | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ChatStore();
    this.instance.load();
    return this.instance;
  }

  chats = new Map<string, Chat>();
  deleted = new Set<string>();

  add(chat: Chat) {
    this.chats.set(chat.id, chat);
    this.dispatchEvent(new Event("change"));
  }

  delete(chat_id: string) {
    this.chats.delete(chat_id);
    this.deleted.add(chat_id);
    this.dispatchEvent(new Event("change"));
  }

  saveIndex() {
    const chat_ids = Array.from(this.chats.keys());
    const index = JSON.stringify(chat_ids);
    localStorage.setItem("chats", index);
    for (const chat_id of this.deleted) localStorage.removeItem(chat_id);
  }

  saveChat(chat: Chat) {
    const chat_data = JSON.stringify(chat);
    localStorage.setItem(chat.id, chat_data);
  }

  load() {
    const index = localStorage.getItem("chats");
    if (!index) return;
    const chat_ids = JSON.parse(index);
    for (const chat_id of chat_ids) this.loadChat(chat_id);
  }

  loadChat(chat_id: string) {
    const chat_data = localStorage.getItem(chat_id);
    if (!chat_data) return;
    try {
      const chat = Chat.from(JSON.parse(chat_data));
      this.add(chat);
    } catch (error) {
      console.error(error);
      localStorage.removeItem(chat_id);
    }
  }
}
