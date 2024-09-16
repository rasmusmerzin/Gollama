import "./HeaderElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatMenu } from "./ChatMenu";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class HeaderElement extends Element {
  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();

  heading = createElement("h4");
  model = createElement("i");

  chat_abort: AbortController | null = null;

  constructor() {
    super();
    this.bind(this.active_chat_store, "change");
    this.append(createElement("div", {}, [this.heading, this.model]));
    this.render();
  }

  remove() {
    super.remove();
    this.chat_abort?.abort();
  }

  render() {
    this.chat_abort?.abort();
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (chat) {
      this.chat_abort = new AbortController();
      chat.addEventListener("change", this.render.bind(this), this.chat_abort);
      this.heading.innerText = chat.title;
      this.model.innerText = chat.model;
      this.oncontextmenu = () => ChatMenu({ chat });
      this.classList.remove("center");
    } else {
      this.classList.add("center");
      this.heading.innerText = "New Chat";
      this.model.innerText = "";
      this.oncontextmenu = null;
    }
  }
}

customElements.define("header-element", HeaderElement);
