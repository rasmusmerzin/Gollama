import "./NewChatElement.css";
import { Chat } from "./Chat";
import { ChatStore } from "./ChatStore";
import { OllamaModel, OllamaService } from "./OllamaService";
import { RouteStore } from "./RouteStore";
import { Size } from "./Size";
import { createElement } from "./createElement";

export class NewChatElement extends HTMLElement {
  route_store = RouteStore.get();
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
      this.render();
    } catch (error) {
      this.route_store.set("error", String(error));
    } finally {
      this.classList.remove("loading");
    }
  }

  render() {
    this.innerHTML = "";
    const model_container = createElement("div", { className: "models" });
    for (const model of this.models || []) {
      const input = createElement("input", { type: "radio", name: "model" });
      this.model_items.set(model.name, input);
      model_container.append(
        createElement("div", { onclick: () => this.selectModel(model.name) }, [
          input,
          createElement("label", { innerText: model.name }),
          createElement("span", { innerText: new Size(model.size).toString() }),
        ]),
      );
    }
    this.submit_button.disabled = true;
    this.append(
      createElement("form", { onsubmit: this.submit.bind(this) }, [
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

  submit(event: Event) {
    event.preventDefault();
    const { model } = this;
    if (!model) return;
    const chat = Chat.from({ model, title: this.title_input.value });
    this.chat_store.add(chat);
    this.route_store.set("chat", chat.id);
    this.title_input.value = "";
  }
}

customElements.define("new-chat-element", NewChatElement);
