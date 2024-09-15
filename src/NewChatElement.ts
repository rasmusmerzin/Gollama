import "./NewChatElement.css";
import { ActiveChatStore } from "./ActiveChatStore";
import { Chat } from "./Chat";
import { ChatStore } from "./ChatStore";
import { createElement } from "./createElement";
import { OllamaModel, OllamaService } from "./OllamaService";

export class NewChatElement extends HTMLElement {
  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();
  ollama_service = OllamaService.get();

  models: Array<OllamaModel> | null = null;
  model: string | null = null;

  model_items = new Map<string, HTMLInputElement>();
  title_input = createElement("input", {
    id: "input",
    type: "text",
    placeholder: "New Chat",
  });
  submit_button = createElement("button", {
    innerText: "Create New Chat",
    className: "primary",
    onclick: () => this.submit(),
  });

  constructor() {
    super();
    this.start();
  }

  async start() {
    this.innerHTML = "";
    this.classList.add("loading");
    try {
      this.models = await this.ollama_service.listModels();
    } finally {
      this.classList.remove("loading");
      this.render();
    }
  }

  render() {
    this.innerHTML = "";
    if (!this.models) return;
    const model_container = createElement("div", { className: "models" });
    for (const model of this.models) {
      const input = createElement("input", { type: "radio", name: "model" });
      this.model_items.set(model.name, input);
      model_container.append(
        createElement("div", { onclick: () => this.selectModel(model.name) }, [
          input,
          createElement("label", { innerText: model.name }),
        ]),
      );
    }
    this.submit_button.disabled = true;
    this.append(
      createElement("form", {}, [
        createElement("div", {}, [
          createElement("div", { innerText: "Title" }),
          this.title_input,
        ]),
        createElement("div", {}, [
          createElement("div", { innerText: "Model" }),
          model_container,
        ]),
        this.submit_button,
      ]),
    );
  }

  selectModel(model: string) {
    this.model = model;
    this.submit_button.disabled = false;
    const input = this.model_items.get(model);
    if (input) input.checked = true;
  }

  submit() {
    const { model } = this;
    if (!model) return;
    const chat = Chat.from({ model, title: this.title_input.value });
    this.chat_store.add(chat);
    this.active_chat_store.set(chat.id);
    this.title_input.value = "";
  }
}

customElements.define("new-chat-element", NewChatElement);
