import "./NewChatElement.css";
import { Chat } from "./Chat";
import { ChatStore } from "./ChatStore";
import { Element } from "./Element";
import { ModelService } from "./ModelService";
import { ModelStore } from "./ModelStore";
import { NewChatModelElement } from "./NewChatModelElement";
import { RouteStore } from "./RouteStore";
import { createElement } from "./createElement";

export class NewChatElement extends Element {
  chat_store = ChatStore.get();
  model_service = ModelService.get();
  model_store = ModelStore.get();
  route_store = RouteStore.get();

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

  async start() {
    this.render();
    this.classList.add("loading");
    this.bind(this.model_store, "change");
    try {
      await this.model_service.load();
    } catch (error) {
      this.route_store.set("error", String(error));
    } finally {
      this.classList.remove("loading");
    }
  }

  render() {
    for (const element of this.model_elements.values()) element.remove();
    this.model_elements.clear();
    const model_container = createElement("div", { className: "models" });
    for (const model of this.model_store.models.values()) {
      const element = new NewChatModelElement(model);
      element.onclick = () => this.selectModel(model.name);
      this.model_elements.set(model.name, element);
      model_container.append(element);
    }
    this.submit_button.disabled = true;
    this.replaceChildren(
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
    this.model_elements.get(<string>this.route_store.detail)?.click();
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
