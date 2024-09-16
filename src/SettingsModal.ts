import "./SettingsModal.css";
import { Modal } from "./Modal";
import { Color, SettingsStore } from "./SettingsStore";
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

  layout_cozy_radio = createElement("input", {
    name: "layout",
    type: "radio",
  });
  layout_wide_radio = createElement("input", {
    name: "layout",
    type: "radio",
  });

  color_container = createElement("div");
  color_labels = new Map<Color, HTMLElement>();

  constructor() {
    super();
    this.bind(this.settings, "change");
    for (const color of Object.values(Color)) {
      const label = createElement("label", {
        className: "color",
        tabIndex: 0,
        onclick: () => this.settings.setColor(color),
      });
      label.style.background = color;
      this.color_labels.set(color, label);
      this.color_container.append(label);
    }
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
              { onclick: () => this.settings.setLayout("cozy") },
              [
                this.layout_cozy_radio,
                createElement("label", { innerText: "Cozy" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.settings.setLayout("wide") },
              [
                this.layout_wide_radio,
                createElement("label", { innerText: "Wide" }),
              ],
            ),
          ]),
        ]),
        createElement("div", {}, [
          createElement("div", { innerText: "Color" }),
          this.color_container,
        ]),
      ]),
      this.button,
    );
    this.render();
  }

  render() {
    for (const [color, label] of this.color_labels) {
      if (this.settings.color === color) label.classList.add("active");
      else label.classList.remove("active");
    }
    this.theme_system_radio.checked = this.settings.theme === "system";
    this.theme_dark_radio.checked = this.settings.theme === "dark";
    this.theme_light_radio.checked = this.settings.theme === "light";
    this.layout_cozy_radio.checked = this.settings.layout === "cozy";
    this.layout_wide_radio.checked = this.settings.layout === "wide";
  }
}

customElements.define("settings-modal", SettingsModal);
