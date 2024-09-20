import { ModelStore } from "./ModelStore";
import { OllamaService } from "./OllamaService";

export class ModelService {
  static instance?: ModelService;
  static get() {
    if (!this.instance) this.instance = new ModelService();
    return this.instance;
  }

  ollama_service = OllamaService.get();
  model_store = ModelStore.get();

  async load() {
    const models = await this.ollama_service.listModels();
    this.model_store.set(models);
  }
}
