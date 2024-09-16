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
  error?: Error;

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
    } catch (error) {
      this.error = error as Error;
    } finally {
      this.classList.remove("loading");
      this.render();
    }
  }

  render() {
    this.innerHTML = "";
    if (this.error) {
      this.append(
        createElement("img", {
          src: "/src/ollama.svg",
        }),
        createElement("div", {
          innerText: "Couldn't communicate with Ollama service.",
        }),
        createElement("code", {
          innerText: this.error.toString(),
        }),
        createElement("div", {
          innerText: "Make sure you have Ollama installed.",
        }),
        createElement("a", {
          innerText: "View installation instructions here.",
          href: "https://ollama.com/download",
          target: "_blank",
        }),
      );
      this.classList.add("error");
      return;
    }
    this.classList.remove("error");
    const model_container = createElement("div", { className: "models" });
    for (const model of this.models || []) {
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
    this.active_chat_store.set(chat.id);
    this.title_input.value = "";
  }
}

customElements.define("new-chat-element", NewChatElement);
