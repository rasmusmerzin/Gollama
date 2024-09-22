import { Size } from "./Size";

export interface ModelDetials {
  format: string;
  family: string;
  parameter_size: string;
  quantization_level: string;
}

export class Model extends EventTarget {
  name = "gemma:2b";
  size = 0;
  details: Partial<ModelDetials> = {};
  running = false;

  getSizeString() {
    return new Size(this.size).toString();
  }

  static from({ name, size, details }: Partial<Model> = {}) {
    const model = new Model();
    if (name) model.name = name;
    if (size) model.size = size;
    if (details) model.details = details;
    return model;
  }

  apply({ name, size, details }: Partial<Model> = {}) {
    if (name) this.name = name;
    if (size) this.size = size;
    if (details) this.details = details;
    this.dispatchEvent(new Event("change"));
  }

  setRunning(value: boolean) {
    this.running = value;
    this.dispatchEvent(new Event("change"));
  }
}
