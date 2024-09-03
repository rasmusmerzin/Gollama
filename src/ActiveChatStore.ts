export class ActiveChatStore extends EventTarget {
  static instance: ActiveChatStore | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ActiveChatStore();
    this.instance.load();
    return this.instance;
  }

  chat_id: string | null = null;

  set(chat_id: string | null) {
    this.chat_id = chat_id;
    this.dispatchEvent(new Event("change"));
    this.save();
  }

  load() {
    this.chat_id = localStorage.getItem("active_chat");
  }

  save() {
    if (this.chat_id) localStorage.setItem("active_chat", this.chat_id);
    else localStorage.removeItem("active_chat");
  }
}
