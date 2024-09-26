import "./ModelListItemElement.css";
import { Element } from "./Element";
import { Model } from "./Model";
import { createElement } from "./createElement";
import { RouteStore } from "./RouteStore";

export class ModelListItemElement extends Element {
  route_store = RouteStore.get();

  name = createElement("b");
  size = createElement("div");
  format = createElement("div");
  family = createElement("div");
  parameters = createElement("div");
  quantization = createElement("div");
  indicator = createElement("div", {
    className: "indicator",
    tooltip: "Model is running",
  });

  constructor(readonly model: Model) {
    super();
    this.tabIndex = 0;
    this.append(
      this.name,
      this.size,
      this.parameters,
      this.format,
      this.family,
      this.quantization,
      this.indicator,
    );
    this.bind(model, "change");
    this.onclick = () => this.route_store.set("new-chat", this.model.name);
    this.render();
  }

  render() {
    const { format, family, parameter_size, quantization_level } =
      this.model.details;
    this.name.innerText = this.model.name;
    this.size.innerText = `Size: ${this.model.getSizeString()}`;
    this.format.innerText = format ? `Format: ${format}` : "";
    this.family.innerText = family ? `Family: ${family}` : "";
    this.parameters.innerText = parameter_size
      ? `Parameters: ${parameter_size}`
      : "";
    this.quantization.innerText = quantization_level
      ? `Quantization: ${quantization_level}`
      : "";
    if (this.model.running) this.classList.add("running");
    else this.classList.remove("running");
  }
}

customElements.define("model-list-item-element", ModelListItemElement);
