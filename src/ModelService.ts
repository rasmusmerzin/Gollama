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
    const [models, running] = await Promise.all([
      this.ollama_service.listModels(),
      this.ollama_service.listRunningModels(),
    ]);
    this.model_store.set(models);
    this.model_store.setRunning(running);
  }
}
