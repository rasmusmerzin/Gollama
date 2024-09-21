import "./HeaderElement.css";
import { RouteStore } from "./RouteStore";
import { ChatMenu } from "./ChatMenu";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { createElement } from "./createElement";

export class HeaderElement extends Element {
  route_store = RouteStore.get();
  chat_store = ChatStore.get();

  heading = createElement("h4");
  model = createElement("i");

  chat_abort: AbortController | null = null;

  constructor() {
    super();
    this.bind(this.route_store, "change");
    this.append(createElement("div", {}, [this.heading, this.model]));
    this.render();
  }

  remove() {
    super.remove();
    this.chat_abort?.abort();
  }

  render() {
    this.chat_abort?.abort();
    const { chat_id, route } = this.route_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (chat) {
      this.chat_abort = new AbortController();
      chat.addEventListener("change", this.render.bind(this), this.chat_abort);
      this.heading.innerText = chat.title;
      this.model.innerText = chat.model;
      this.oncontextmenu = () => ChatMenu({ target: this, chat });
      this.classList.remove("center");
      return;
    }
    this.classList.add("center");
    this.model.innerText = "";
    this.oncontextmenu = null;
    this.heading.innerText = route.replaceAll("-", " ");
  }
}

customElements.define("header-element", HeaderElement);
