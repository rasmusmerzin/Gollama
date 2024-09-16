import "./AppElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatElement } from "./ChatElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { HeaderElement } from "./HeaderElement";
import { NavigationElement } from "./NavigationElement";
import { NewChatElement } from "./NewChatElement";
import { PreferencesStore } from "./PreferencesStore";

export class AppElement extends Element {
  static instance: AppElement | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new AppElement();
    return this.instance;
  }

  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();
  preferences = PreferencesStore.get();

  navigation_element = new NavigationElement();
  header_element = new HeaderElement();
  main = document.createElement("main");
  new_chat_element = new NewChatElement();
  chat_element: ChatElement | null = null;

  constructor() {
    super();
    this.append(this.navigation_element, this.header_element, this.main);
    this.bind(this.active_chat_store, "change");
    this.bind(this.preferences, "change", this.applyPreferences.bind(this));
    this.applyPreferences();
  }

  applyPreferences() {
    document.body.setAttribute("layout", this.preferences.layout);
    document.body.setAttribute("theme", this.preferences.theme);
    document.body.setAttribute("color", this.preferences.color);
  }

  render() {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (chat) {
      this.new_chat_element.remove();
      this.chat_element?.remove();
      this.main.append((this.chat_element = new ChatElement(chat)));
    } else {
      this.chat_element?.remove();
      this.main.append(this.new_chat_element);
      this.new_chat_element.start();
    }
  }
}

customElements.define("app-element", AppElement);
