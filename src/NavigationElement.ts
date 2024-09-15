import "./NavigationElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { ChatListElement } from "./ChatListElement";
import { Element } from "./Element";
import { SettingsModal } from "./SettingsModal";
import { SettingsStore } from "./SettingsStore";
import { createElement } from "./createElement";

export class NavigationElement extends Element {
  active_chat_store = ActiveChatStore.get();
  settings_store = SettingsStore.get();

  new_chat_button: HTMLButtonElement;
  settings_button: HTMLButtonElement;
  menu_button: HTMLButtonElement;

  constructor() {
    super();
    this.append(
      (this.new_chat_button = createElement("button", {
        innerText: "New Chat",
        className: "primary",
        onclick: () => this.active_chat_store.set(null),
      })),
      new ChatListElement(),
      (this.settings_button = createElement("button", {
        innerText: "Settings",
        title: "Press Ctrl+I to toggle settings menu",
        onclick: () => {
          const modal = document.getElementById("modal");
          if (modal) modal.remove();
          if (!modal || !(modal instanceof SettingsModal)) new SettingsModal();
        },
      })),
      (this.menu_button = createElement("button", {
        className: "menu",
        title: "Press Ctrl+N to toggle chat list",
        onclick: () => this.toggle(),
      })),
    );
    this.bind(this.settings_store, "change");
    this.bind(window, "keydown", this.keydown.bind(this));
    this.render();
  }

  keydown(event: Event) {
    const { key, ctrlKey, altKey } = event as KeyboardEvent;
    if (!ctrlKey && !altKey) return;
    if (key === "0") {
      this.new_chat_button.click();
      this.new_chat_button.focus();
    } else if (["I", "i"].includes(key)) {
      this.settings_button.click();
      this.settings_button.focus();
    } else if (["N", "n"].includes(key)) {
      this.menu_button.click();
      this.menu_button.focus();
    }
  }

  toggle() {
    this.settings_store.toggleNavigationOpen();
  }

  render() {
    if (this.settings_store.navigation_open) this.classList.remove("closed");
    else this.classList.add("closed");
  }
}

customElements.define("navigation-element", NavigationElement);
