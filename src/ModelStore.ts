import { OllamaModel } from "./OllamaService";

export class ModelStore extends EventTarget {
  static instance?: ModelStore;
  static get() {
    if (!this.instance) this.instance = new ModelStore();
    return this.instance;
  }

  models = new Map<string, OllamaModel>();

  set(models: OllamaModel[]) {
    this.models.clear();
    for (const model of models) this.models.set(model.name, model);
    this.dispatchEvent(new Event("change"));
  }

  add(model: OllamaModel) {
    this.models.set(model.name, model);
    this.dispatchEvent(new Event("change"));
  }
}
