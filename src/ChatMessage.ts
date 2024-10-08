import { Chat } from "./Chat";
import { uid } from "./uid";

export class ChatMessage extends EventTarget {
  id = uid();
  role: "user" | "assistant" = "user";
  content = "";
  images = new Array<string>();
  controller?: AbortController;
  loading = false;
  done = true;
  chat: Chat | null = null;

  static from({ id, role, content, images, done }: Partial<ChatMessage> = {}) {
    const message = new ChatMessage();
    if (id) message.id = id;
    if (role) message.role = role;
    if (content) message.content = content;
    if (images) message.images = images;
    if (done != null) message.done = done;
    return message;
  }

  toJSON() {
    return {
      id: this.id,
      role: this.role,
      content: this.content,
      images: this.images,
      done: this.done,
    };
  }

  setDone(done: boolean) {
    this.done = done;
    this.save();
    this.dispatchEvent(new Event("change"));
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }

  push(msg: ChatMessage) {
    this.content += msg.content;
    if (msg.images) this.images.push(...msg.images);
    this.save();
    this.dispatchEvent(new Event("change"));
    this.chat?.dispatchEvent(new Event("change"));
  }

  save() {
    const data = JSON.stringify(this);
    localStorage.setItem(this.id, data);
  }
}
