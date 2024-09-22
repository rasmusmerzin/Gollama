import { Model } from "./Model";

export class ModelStore extends EventTarget {
  static instance?: ModelStore;
  static get() {
    if (!this.instance) this.instance = new ModelStore();
    return this.instance;
  }

  models = new Map<string, Model>();

  set(models: Model[]) {
    for (const name of this.models.keys()) {
      if (models.find((model) => model.name === name)) continue;
      this.models.delete(name);
    }
    for (const model of models) {
      const slot = this.models.get(model.name);
      if (slot) slot.apply(model);
      else this.models.set(model.name, model);
    }
    this.dispatchEvent(new Event("change"));
  }

  setRunning(models: Model[]) {
    for (const [name, model] of this.models) {
      if (models.find((m) => m.name === name)) continue;
      model.setRunning(false);
    }
    for (const model of models) {
      let slot = this.models.get(model.name);
      if (slot) slot.apply(model);
      else slot = model;
      slot.setRunning(true);
      this.models.set(model.name, model);
    }
    this.dispatchEvent(new Event("change"));
  }
}
