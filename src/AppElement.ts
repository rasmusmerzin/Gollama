import "./AppElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatElement } from "./ChatElement";
import { ChatStore } from "./ChatStore";
import { NavigationElement } from "./NavigationElement";
import { NewChatElement } from "./NewChatElement";

export class AppElement extends HTMLElement {
  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();

  navigation_element = new NavigationElement();
  new_chat_element = new NewChatElement();
  chat_element: ChatElement | null = null;

  constructor() {
    super();
    this.render();
    this.active_chat_store.addEventListener("change", this.render.bind(this));
  }

  render() {
    this.new_chat_element.remove();
    this.chat_element?.remove();
    this.append(this.navigation_element);
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    this.append(
      chat
        ? (this.chat_element = new ChatElement(chat))
        : this.new_chat_element,
    );
  }
}

customElements.define("app-element", AppElement);
