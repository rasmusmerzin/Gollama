import { ChatMessage } from "./ChatMessage";

export interface OllamaModel {
  name: string;
}

export class OllamaService {
  static instance: OllamaService | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new OllamaService();
    return this.instance;
  }

  readonly origin = "http://localhost:11434";

  async chatResponse(
    model: string,
    messages: Array<ChatMessage>,
  ): Promise<ChatMessage> {
    const url = new URL("/api/chat", this.origin);
    const body = JSON.stringify({ model, messages, stream: false });
    const response = await fetch(url, { method: "post", body });
    const object = await response.json();
    return ChatMessage.from(object.message);
  }

  async listModels(): Promise<Array<OllamaModel>> {
    const url = new URL("/api/tags", this.origin);
    const response = await fetch(url);
    const object = await response.json();
    return object.models;
  }
}
