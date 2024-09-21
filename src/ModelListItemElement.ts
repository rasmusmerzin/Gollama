import "./ModelListItemElement.css";
import { Element } from "./Element";
import { Model } from "./Model";
import { createElement } from "./createElement";

export class ModelListItemElement extends Element {
  name = createElement("b");
  size = createElement("div");
  format = createElement("div");
  family = createElement("div");
  parameters = createElement("div");
  quantization = createElement("div");

  constructor(readonly model: Model) {
    super();
    this.append(
      this.name,
      this.size,
      this.parameters,
      this.format,
      this.family,
      this.quantization,
    );
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
  }
}

customElements.define("model-list-item-element", ModelListItemElement);
