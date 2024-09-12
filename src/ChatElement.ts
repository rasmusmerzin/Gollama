import "./ChatElement.css";
import { Chat } from "./Chat";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ChatInputElement } from "./ChatInputElement";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageElement } from "./ChatMessageElement";

export class ChatElement extends Element {
  container = createElement("div");
  input = new ChatInputElement();
  fixed_at_bottom = true;

  constructor(readonly chat: Chat) {
    super();
    chat.load();
    this.append(this.container, this.input);
    for (const message of chat.messages.values()) this.addMessage(message);
    this.bind(chat, "change", this.onChange.bind(this));
    this.bind(chat, "add", this.addLastMessage.bind(this));
    this.bind(chat, "delete", this.ondelete.bind(this));
    this.bind(window, "resize", this.onChange.bind(this));
    this.bind(this.container, "scroll", this.onScroll.bind(this));
    this.onChange();
  }

  onScroll() {
    this.fixed_at_bottom = this.isAtBottom();
  }

  onChange() {
    this.input.disabled = this.chat.last_message?.loading || false;
    if (this.fixed_at_bottom) this.scrollToBottom();
    else this.fixed_at_bottom = this.isAtBottom();
    setTimeout(() => this.input.focus());
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
    const scroll_bottom =
      this.container.scrollTop + this.container.clientHeight;
    return scroll_bottom >= this.container.scrollHeight - 1;
  }

  scrollToBottom() {
    this.fixed_at_bottom = true;
    this.container.scrollTo(0, this.container.scrollHeight);
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
