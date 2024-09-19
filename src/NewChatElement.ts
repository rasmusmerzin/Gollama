import "./NewChatElement.css";
import { Chat } from "./Chat";
import { ChatStore } from "./ChatStore";
import { NewChatModelElement } from "./NewChatModelElement";
import { OllamaModel, OllamaService } from "./OllamaService";
import { RouteStore } from "./RouteStore";
import { createElement } from "./createElement";

export class NewChatElement extends HTMLElement {
  route_store = RouteStore.get();
  chat_store = ChatStore.get();
  ollama_service = OllamaService.get();

  models: Array<OllamaModel> | null = null;
  model: string | null = null;

  model_elements = new Map<string, NewChatModelElement>();
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
    for (const element of this.model_elements.values()) element.remove();
    this.model_elements.clear();
    const model_container = createElement("div", { className: "models" });
    for (const model of this.models || []) {
      const element = new NewChatModelElement(model);
      element.onclick = () => this.selectModel(model.name);
      this.model_elements.set(model.name, element);
      model_container.append(element);
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
    this.title_input.focus();
  }

  selectModel(model: string) {
    this.model = model;
    this.submit_button.disabled = false;
    for (const [name, element] of this.model_elements)
      element.set(name === model);
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
