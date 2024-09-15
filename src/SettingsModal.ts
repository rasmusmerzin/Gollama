import "./SettingsModal.css";
import { Modal } from "./Modal";
import { SettingsStore } from "./SettingsStore";
import { createElement } from "./createElement";

export class SettingsModal extends Modal {
  settings = SettingsStore.get();

  title_label = createElement("h2", { innerText: "Settings" });
  theme_system_radio = createElement("input", {
    type: "radio",
    name: "theme",
    value: "system",
    onclick: () => this.settings.setTheme("system"),
  });
  theme_dark_radio = createElement("input", {
    type: "radio",
    name: "theme",
    value: "dark",
    onclick: () => this.settings.setTheme("dark"),
  });
  theme_light_radio = createElement("input", {
    type: "radio",
    name: "theme",
    value: "light",
    onclick: () => this.settings.setTheme("light"),
  });

  constructor() {
    super();
    this.bind(this.settings, "change");
    this.container.append(
      this.title_label,
      createElement("form", {}, [
        createElement("div", {}, [
          createElement("label", { innerText: "Theme" }),
          createElement("div", {}, [
            createElement("div", {}, [
              this.theme_system_radio,
              createElement("label", { innerText: "System" }),
            ]),
            createElement("div", {}, [
              this.theme_dark_radio,
              createElement("label", { innerText: "Dark" }),
            ]),
            createElement("div", {}, [
              this.theme_light_radio,
              createElement("label", { innerText: "Light" }),
            ]),
          ]),
        ]),
      ]),
    );
    this.render();
  }

  render() {
    this.theme_system_radio.checked = this.settings.theme === "system";
    this.theme_dark_radio.checked = this.settings.theme === "dark";
    this.theme_light_radio.checked = this.settings.theme === "light";
  }
}

customElements.define("settings-modal", SettingsModal);
