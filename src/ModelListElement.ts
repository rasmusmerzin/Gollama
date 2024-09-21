import "./ModelListElement.css";
import { Element } from "./Element";
import { ModelListItemElement } from "./ModelListItemElement";
import { ModelService } from "./ModelService";
import { ModelStore } from "./ModelStore";
import { RouteStore } from "./RouteStore";
import { createElement } from "./createElement";

export class ModelListElement extends Element {
  model_service = ModelService.get();
  model_store = ModelStore.get();
  route_store = RouteStore.get();

  items = new Map<string, ModelListItemElement>();

  container = createElement("div", { className: "container" });

  constructor() {
    super();
    this.append(this.container);
  }

  async start() {
    this.render();
    this.classList.add("loading");
    this.bind(this.model_store, "change");
    try {
      await this.model_service.load();
    } catch (error) {
      this.route_store.set("error", String(error));
    } finally {
      this.classList.remove("loading");
    }
  }

  render() {
    for (const [model_name, item] of this.items) {
      if (this.model_store.models.has(model_name)) continue;
      item.remove();
      this.items.delete(model_name);
    }
    for (const model of this.model_store.models.values()) {
      if (this.items.has(model.name)) continue;
      const item = new ModelListItemElement(model);
      this.items.set(model.name, item);
      this.container.append(item);
    }
  }
}

customElements.define("model-list-element", ModelListElement);
