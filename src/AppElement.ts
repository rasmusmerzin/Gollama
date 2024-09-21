import "./AppElement.css";
import { ChatElement } from "./ChatElement";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { ErrorElement } from "./ErrorElement";
import { HeaderElement } from "./HeaderElement";
import { ModelListElement } from "./ModelListElement";
import { NavigationElement } from "./NavigationElement";
import { NewChatElement } from "./NewChatElement";
import { PreferencesStore } from "./PreferencesStore";
import { RouteStore } from "./RouteStore";

export class AppElement extends Element {
  static instance?: AppElement;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new AppElement();
    return this.instance;
  }

  route_store = RouteStore.get();
  chat_store = ChatStore.get();
  preferences = PreferencesStore.get();

  navigation_element = new NavigationElement();
  header_element = new HeaderElement();
  main = document.createElement("main");
  new_chat_element = new NewChatElement();
  error_element = new ErrorElement();
  model_list_element = new ModelListElement();

  constructor() {
    super();
    this.append(this.navigation_element, this.header_element, this.main);
    this.bind(this.route_store, "change");
    this.bind(this.preferences, "change", this.applyPreferences.bind(this));
    this.applyPreferences();
  }

  applyPreferences() {
    document.body.setAttribute("layout", this.preferences.layout);
    document.body.setAttribute("theme", this.preferences.theme);
    document.body.setAttribute("color", this.preferences.color);
  }

  render() {
    for (const child of Array.from(this.main.children)) child.remove();
    const { chat_id } = this.route_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    switch (this.route_store.route) {
      case "models":
        this.main.append(this.model_list_element);
        this.model_list_element.start();
        break;
      case "new-chat":
        this.main.append(this.new_chat_element);
        this.new_chat_element.start();
        break;
      case "chat":
        if (chat) this.main.append(new ChatElement(chat));
        break;
      case "error":
        this.main.append(this.error_element);
        this.error_element.start();
        break;
    }
  }
}

customElements.define("app-element", AppElement);
