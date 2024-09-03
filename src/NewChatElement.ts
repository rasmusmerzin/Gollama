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

  title_input = createElement("input", { value: "New Chat" });
  model_select = createElement("select");
  submit_button = createElement("button", { innerText: "Create New Chat" });
  form = createElement("form");

  constructor() {
    super();
    this.submit_button.onclick = this.submit.bind(this);
    this.start();
  }

  start() {
    this.classList.add("loading");
    this.ollama_service
      .listModels()
      .then(this.load.bind(this))
      .finally(this.done.bind(this));
  }

  load(models: Array<OllamaModel>) {
    this.model_select.innerHTML = "";
    for (const model of models) {
      const option = createElement("option", {
        value: model.name,
        innerText: model.name,
      });
      this.model_select.append(option);
    }
    this.render();
  }

  done() {
    this.classList.remove("loading");
  }

  render() {
    this.innerHTML = "";
    this.form.innerHTML = "";
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
