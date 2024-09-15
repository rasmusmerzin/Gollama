import "./ChatMessageElement.css";
import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { ContextMenuElement } from "./ContextMenuElement";
import { Element } from "./Element";
import { createElement } from "./createElement";
import markdownit from "markdown-it";
import { ImageElement } from "./ImageElement";

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
    this.container.append(this.author, this.content, this.images);
    this.append(this.container);
    this.render();
    this.bind(message, "change");
    this.content.onclick = (e) => e.preventDefault();
    this.container.oncontextmenu = this.contextmenu.bind(this);
  }

  contextmenu() {
    if (this.message.loading) return;
    new ContextMenuElement({
      target: this.container,
      options: [
        {
          name: "Delete Message",
          color: "red",
          action: () => this.chat_service.deleteMessage(this.id),
        },
      ],
    });
  }

  render() {
    if (this.message.loading) this.container.classList.add("loading");
    else this.container.classList.remove("loading");
    this.author.innerText = this.message.role === "assistant" ? "AI" : "ME";
    this.classList.add(this.message.role);
    this.content.innerHTML = MD.render(this.message.content);
    this.images.innerHTML = "";
    for (const image of this.message.images)
      this.images.append(new ImageElement({ src: "data:;base64," + image }));
  }
}

customElements.define("chat-message-element", ChatMessageElement);
