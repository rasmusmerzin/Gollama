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

  title_input = createElement("input", { id: "input" });
  model_select = createElement("select");
  submit_button = createElement("button", { innerText: "Create New Chat" });
  form = createElement("form");

  constructor() {
    super();
    this.submit_button.onclick = this.submit.bind(this);
    this.start();
  }

  start() {
    this.innerHTML = "";
    this.classList.add("loading");
    this.ollama_service
      .listModels()
      .then(this.load.bind(this))
      .finally(this.done.bind(this));
  }

  load(models: Array<OllamaModel>) {
    this.models = models;
  }

  done() {
    this.classList.remove("loading");
    this.render();
  }

  render() {
    this.innerHTML = "";
    if (!this.models?.length) return;
    this.model_select.innerHTML = "";
    for (const model of this.models) {
      const option = createElement("option", {
        value: model.name,
        innerText: model.name,
      });
      this.model_select.append(option);
    }
    this.form.innerHTML = "";
    this.title_input.value = "New Chat";
    this.form.append(
      createElement("div", {}, [
        createElement("label", { innerText: "Model" }),
        this.model_select,
      ]),
      createElement("div", {}, [
        createElement("label", { innerText: "Title" }),
        this.title_input,
      ]),
      this.submit_button,
    );
    this.append(createElement("h2", { innerText: "New Chat" }), this.form);
  }

  submit() {
    const chat = Chat.from({
      title: this.title_input.value,
      model: this.model_select.value,
    });
    this.chat_store.add(chat);
    this.active_chat_store.set(chat.id);
  }
}

customElements.define("new-chat-element", NewChatElement);
