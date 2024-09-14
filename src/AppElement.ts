import "./AppElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatElement } from "./ChatElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { NavigationElement } from "./NavigationElement";
import { NewChatElement } from "./NewChatElement";

export class AppElement extends Element {
  static instance: AppElement | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new AppElement();
    return this.instance;
  }

  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();

  navigation_element = new NavigationElement();
  main = document.createElement("main");
  new_chat_element = new NewChatElement();
  chat_element: ChatElement | null = null;

  constructor() {
    super();
    this.bind(this.active_chat_store, "change");
  }

  render() {
    this.new_chat_element.remove();
    this.chat_element?.remove();
    this.append(this.navigation_element, this.main);
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (chat) this.main.append((this.chat_element = new ChatElement(chat)));
    else {
      this.main.append(this.new_chat_element);
      this.new_chat_element.start();
    }
  }
}

customElements.define("app-element", AppElement);
