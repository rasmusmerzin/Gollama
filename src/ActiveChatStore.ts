export class ActiveChatStore extends EventTarget {
  static instance: ActiveChatStore | null = null;
  static get() {
    return this.instance || (ActiveChatStore.instance = new ActiveChatStore());
  }

  chat_id: string | null = null;

  set(chat_id: string | null) {
    this.chat_id = chat_id;
    this.dispatchEvent(new Event("change"));
  }
}
