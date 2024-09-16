import "./ChatMessageElement.css";
import markdownit from "markdown-it";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageMenu } from "./ChatMessageMenu";
import { ChatService } from "./ChatService";
import { Element } from "./Element";
import { ImageElement } from "./ImageElement";
import { createElement } from "./createElement";

const MD = markdownit();

export class ChatMessageElement extends Element {
  chat_service = ChatService.get();

  container = createElement("div");
  author = createElement("div", { className: "author" });
  content = createElement("div", { className: "content" });
  images = createElement("div", { className: "images" });

  constructor(readonly message: ChatMessage) {
    super();
    this.id = message.id;
    this.container.tabIndex = 0;
    this.container.append(this.author, this.content, this.images);
    this.append(this.container);
    this.render();
    this.bind(message, "change");
    this.content.onclick = (e) => e.preventDefault();
    this.container.oncontextmenu = this.contextmenu.bind(this);
    this.bind(window, "keydown", this.keydown.bind(this));
  }

  keydown(event: Event) {
    if (document.activeElement !== this.container) return;
    const { key, ctrlKey, altKey } = event as KeyboardEvent;
    if (ctrlKey || altKey) return;
    if ([" ", "Enter"].includes(key))
      (this.images.children[0] as HTMLElement)?.click();
  }

  contextmenu() {
    if (this.message.loading) return;
    ChatMessageMenu({ target: this.container, message: this.message });
  }

  render() {
    if (this.message.loading) this.container.classList.add("loading");
    else this.container.classList.remove("loading");
    this.author.innerText = this.message.role === "assistant" ? "AI" : "ME";
    this.classList.add(this.message.role);
    this.content.innerHTML = MD.render(this.message.content);
    this.images.innerHTML = "";
    for (const image of this.message.images) {
      const element = new ImageElement({
        listed: true,
        src: "data:;base64," + image,
      });
      this.images.append(element);
    }
  }
}

customElements.define("chat-message-element", ChatMessageElement);
