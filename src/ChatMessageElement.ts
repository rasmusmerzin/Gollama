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

  container = createElement("div");
  content = createElement("div", { className: "content" });
  images = createElement("div", { className: "images" });

  constructor(readonly message: ChatMessage) {
    super();
    this.id = message.id;
    this.container.append(this.content, this.images);
    this.append(this.container);
    this.render();
    message.addEventListener("change", this.render.bind(this), this.control);
    this.content.onclick = (e) => e.preventDefault();
    this.container.oncontextmenu = ({ clientX, clientY }) => {
      if (this.message.loading) return;
      const delete_option = {
        name: "Delete Message",
        color: "red",
        action: () => this.chat_service.deleteMessage(this.id),
      };
      new ContextMenuElement({
        x: clientX,
        y: clientY,
        options: [delete_option],
      });
    };
  }

  render() {
    if (this.message.loading) this.container.classList.add("loading");
    else this.container.classList.remove("loading");
    this.classList.add(this.message.role);
    this.content.innerHTML = MD.render(this.message.content);
    this.images.innerHTML = "";
    for (const image_base64 of this.message.images) {
      const img = createElement("img");
      img.src = "data:;base64," + image_base64;
      img.alt = "Image";
      img.height = 96;
      this.images.append(img);
    }
  }
}

customElements.define("chat-message-element", ChatMessageElement);
