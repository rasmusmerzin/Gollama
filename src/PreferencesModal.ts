import "./PreferencesModal.css";
import { Modal } from "./Modal";
import { Color, PreferencesStore } from "./PreferencesStore";
import { createElement } from "./createElement";

export class PreferencesModal extends Modal {
  preferences = PreferencesStore.get();

  title_label = createElement("h2", { innerText: "Preferences" });
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
    this.bind(this.preferences, "change");
    for (const color of Object.values(Color)) {
      const label = createElement("label", {
        className: "color",
        tabIndex: 0,
        onclick: () => this.preferences.setColor(color),
      });
      label.setAttribute("color", color);
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
              { onclick: () => this.preferences.setTheme("system") },
              [
                this.theme_system_radio,
                createElement("label", { innerText: "System" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.preferences.setTheme("dark") },
              [
                this.theme_dark_radio,
                createElement("label", { innerText: "Dark" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.preferences.setTheme("light") },
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
              { onclick: () => this.preferences.setLayout("cozy") },
              [
                this.layout_cozy_radio,
                createElement("label", { innerText: "Cozy" }),
              ],
            ),
            createElement(
              "div",
              { onclick: () => this.preferences.setLayout("wide") },
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
      if (this.preferences.color === color) label.classList.add("active");
      else label.classList.remove("active");
    }
    this.theme_system_radio.checked = this.preferences.theme === "system";
    this.theme_dark_radio.checked = this.preferences.theme === "dark";
    this.theme_light_radio.checked = this.preferences.theme === "light";
    this.layout_cozy_radio.checked = this.preferences.layout === "cozy";
    this.layout_wide_radio.checked = this.preferences.layout === "wide";
  }
}

customElements.define("preferences-modal", PreferencesModal);
