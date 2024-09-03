import "./ChatMessageElement.css";
import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { ContextMenuElement } from "./ContextMenuElement";
import { Element } from "./Element";
import { createElement } from "./createElement";
import markdownit from "markdown-it";

const MD = markdownit();

export class ChatMessageElement extends Element {
  chat_service = ChatService.get();

  content = createElement("div");

  constructor(readonly message: ChatMessage) {
    super();
    this.id = message.id;
    this.append(this.content);
    this.render();
    message.addEventListener("change", this.render.bind(this), this.control);
    this.oncontextmenu = ({ clientX, clientY }) => {
      if (this.message.loading) return;
      new ContextMenuElement({
        x: clientX,
        y: clientY,
        options: [
          {
            name: "Delete",
            action: () => this.chat_service.deleteMessage(this.id),
          },
        ],
      });
    };
    this.content.onclick = (e) => e.preventDefault();
  }

  render() {
    if (this.message.loading) this.content.classList.add("loading");
    else this.content.classList.remove("loading");
    this.classList.add(this.message.role);
    this.content.innerHTML = MD.render(this.message.content);
  }
}

customElements.define("chat-message-element", ChatMessageElement);
