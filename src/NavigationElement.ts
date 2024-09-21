import "./NavigationElement.css";
import { ChatListElement } from "./ChatListElement";
import { Element } from "./Element";
import { PreferencesModal } from "./PreferencesModal";
import { PreferencesStore } from "./PreferencesStore";
import { RouteStore } from "./RouteStore";
import { createElement } from "./createElement";

export class NavigationElement extends Element {
  route_store = RouteStore.get();
  preferences = PreferencesStore.get();

  new_chat_button: HTMLButtonElement;
  models_button: HTMLButtonElement;
  preferences_button: HTMLButtonElement;
  menu_button: HTMLButtonElement;

  constructor() {
    super();
    this.append(
      (this.new_chat_button = createElement("button", {
        innerText: "New Chat",
        className: "primary",
        title: "Press Ctrl+N to open new chat form",
        onclick: () => this.route_store.set("new-chat"),
      })),
      new ChatListElement(),
      (this.models_button = createElement("button", {
        innerText: "Models",
        title: "Press Ctrl+Shift+M to open model list",
        onclick: () => this.route_store.set("models"),
      })),
      (this.preferences_button = createElement("button", {
        innerText: "Preferences",
        title: "Press Ctrl+P to toggle preferences menu",
        onclick: () => {
          const modal = document.getElementById("modal");
          if (modal) modal.remove();
          if (!modal || !(modal instanceof PreferencesModal))
            new PreferencesModal();
        },
      })),
      (this.menu_button = createElement("button", {
        className: "menu",
        title: "Press Ctrl+M to toggle chat list",
        onclick: (event: Event) => {
          event.stopPropagation();
          this.toggle();
        },
      })),
    );
    this.bind(this.preferences, "change");
    this.bind(window, "keydown", this.keydown.bind(this));
    this.bind(window, "resize", this.autoToggle.bind(this));
    this.onclick = this.autoToggle.bind(this);
    this.render();
  }

  autoToggle() {
    const { navigation_open } = this.preferences;
    if (navigation_open && innerWidth < 600)
      this.preferences.setNavigationOpen(false);
    if (!navigation_open && innerWidth > 960)
      this.preferences.setNavigationOpen(true);
  }

  keydown(event: Event) {
    const { key, ctrlKey, altKey } = event as KeyboardEvent;
    if (!ctrlKey && !altKey) return;
    if (["N", "n"].includes(key)) this.new_chat_button.click();
    else if (["P", "p"].includes(key)) this.preferences_button.click();
    else if (["M", "m"].includes(key)) this.menu_button.click();
  }

  toggle() {
    this.preferences.toggleNavigationOpen();
    const touch = () => this.preferences.dispatchEvent(new Event("change"));
    setTimeout(touch, 100);
  }

  render() {
    if (this.preferences.navigation_open) {
      document.body.removeAttribute("navigation_closed");
      this.classList.remove("closed");
      this.menu_button.classList.remove("primary");
    } else {
      document.body.setAttribute("navigation_closed", "");
      this.classList.add("closed");
      this.menu_button.classList.add("primary");
    }
  }
}

customElements.define("navigation-element", NavigationElement);
