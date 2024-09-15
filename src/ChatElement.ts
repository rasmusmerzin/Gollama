import "./ChatElement.css";
import { AppElement } from "./AppElement";
import { Chat } from "./Chat";
import { ChatInputElement } from "./ChatInputElement";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageElement } from "./ChatMessageElement";
import { Element } from "./Element";
import { SettingsStore } from "./SettingsStore";
import { createElement } from "./createElement";

export class ChatElement extends Element {
  app = AppElement.get();
  settings = SettingsStore.get();

  container = createElement("div");
  input = ChatInputElement.get();
  fixed_at_bottom = true;

  constructor(readonly chat: Chat) {
    super();
    this.append(this.container, this.input);
    this.bind(chat, "change");
    this.bind(window, "resize");
    this.bind(this.settings, "change");
    this.bind(this.input, "filechange");
    this.bind(chat, "add", this.addLastMessage.bind(this));
    this.bind(chat, "delete", this.ondelete.bind(this));
    this.bind(this.app.main, "scroll", this.onScroll.bind(this));
    this.render();
    this.classList.add("loading");
    setTimeout(() => this.start());
  }

  start() {
    this.chat.load();
    for (const message of this.chat.messages.values()) this.addMessage(message);
    this.render();
    this.classList.remove("loading");
  }

  onScroll() {
    this.fixed_at_bottom = this.isAtBottom();
  }

  render() {
    this.setAttribute("layout", this.settings.layout);
    this.input.disabled = this.chat.last_message?.loading || false;
    if (this.fixed_at_bottom) this.scrollToBottom();
    else this.fixed_at_bottom = this.isAtBottom();
  }

  addLastMessage() {
    const msg = this.chat.last_message;
    if (msg) this.addMessage(msg);
  }

  addMessage(message: ChatMessage) {
    this.container.append(new ChatMessageElement(message));
    setTimeout(() => this.scrollToBottom());
  }

  isAtBottom() {
    const scroll_bottom = this.app.main.scrollTop + this.app.main.clientHeight;
    return scroll_bottom >= this.app.main.scrollHeight - 1;
  }

  scrollToBottom() {
    this.fixed_at_bottom = true;
    this.app.main.scrollTo(0, this.app.main.scrollHeight);
  }

  ondelete(event: Event) {
    const { detail } = <CustomEvent>event;
    this.container.querySelector(`#${detail}`)?.remove();
  }

  remove() {
    for (const child of Array.from(this.container.children)) child.remove();
    super.remove();
  }
}

customElements.define("chat-element", ChatElement);
