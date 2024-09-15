import "./SettingsModal.css";
import { Modal } from "./Modal";
import { SettingsStore } from "./SettingsStore";
import { createElement } from "./createElement";

export class SettingsModal extends Modal {
  settings = SettingsStore.get();

  title_label = createElement("h2", { innerText: "Settings" });
  button = createElement("button", {
    innerText: "Close",
    onclick: () => this.remove(),
  });

  theme_system_radio = createElement("input", { name: "theme", type: "radio" });
  theme_dark_radio = createElement("input", { name: "theme", type: "radio" });
  theme_light_radio = createElement("input", { name: "theme", type: "radio" });

  layout_normal_radio = createElement("input", {
    name: "layout",
    type: "radio",
  });
  layout_dense_radio = createElement("input", {
    name: "layout",
    type: "radio",
  });

  constructor() {
    super();
    this.bind(this.settings, "change");
    this.container.append(
      this.title_label,
      createElement("form", {}, [
        createElement("div", {}, [
          createElement("div", { innerText: "Theme" }),
          createElement("div", {}, [
            createElement(
              "div",
              { onclick: () => this.settings.setTheme("system") },
              [
                this.theme_system_radio,
                createElement("label", { innerText: "System" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.settings.setTheme("dark") },
              [
                this.theme_dark_radio,
                createElement("label", { innerText: "Dark" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.settings.setTheme("light") },
              [
                this.theme_light_radio,
                createElement("label", { innerText: "Light" }),
              ],
            ),
          ]),
        ]),
        createElement("div", {}, [
          createElement("div", { innerText: "Layout" }),
          createElement("div", {}, [
            createElement(
              "div",
              { onclick: () => this.settings.setLayout("normal") },
              [
                this.layout_normal_radio,
                createElement("label", { innerText: "Normal" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.settings.setLayout("dense") },
              [
                this.layout_dense_radio,
                createElement("label", { innerText: "Dense" }),
              ],
            ),
          ]),
        ]),
      ]),
      this.button,
    );
    this.render();
  }

  render() {
    this.theme_system_radio.checked = this.settings.theme === "system";
    this.theme_dark_radio.checked = this.settings.theme === "dark";
    this.theme_light_radio.checked = this.settings.theme === "light";
    this.layout_normal_radio.checked = this.settings.layout === "normal";
    this.layout_dense_radio.checked = this.settings.layout === "dense";
  }
}

customElements.define("settings-modal", SettingsModal);
