import "./ChatMessageElement.css";
import markdownit from "markdown-it";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageMenu } from "./ChatMessageMenu";
import { ChatService } from "./ChatService";
import { Element } from "./Element";
import { ImageListElement } from "./ImageListElement";
import { createElement } from "./createElement";

const MD = markdownit();

export class ChatMessageElement extends Element {
  chat_service = ChatService.get();

  author = createElement("div", { className: "author" });
  container = createElement("div", { className: "container" });
  content = createElement("div", { className: "content" });
  images = new ImageListElement({ listed: true });
  alert = createElement("div", {
    className: "alert material-icons",
    innerText: "warning",
    tooltip: "Message is incomplete",
  });

  constructor(readonly message: ChatMessage) {
    super();
    this.id = message.id;
    this.container.tabIndex = 0;
    this.append(this.author, this.container);
    this.container.append(this.content, this.images, this.alert);
    this.render();
    this.bind(message, "change");
    this.content.onclick = (e) => e.preventDefault();
    this.container.oncontextmenu = () =>
      ChatMessageMenu({ target: this.container, message });
    this.bind(window, "keydown", this.keydown.bind(this));
  }

  keydown(event: Event) {
    if (document.activeElement !== this.container) return;
    const { key, ctrlKey, altKey } = event as KeyboardEvent;
    if (ctrlKey || altKey) return;
    if ([" ", "Enter"].includes(key))
      (this.images.children[0] as HTMLElement)?.click();
  }

  render() {
    if (this.message.loading) this.container.classList.add("loading");
    else this.container.classList.remove("loading");
    if (this.message.done) this.container.classList.add("done");
    else this.container.classList.remove("done");
    this.author.innerText = this.message.role === "assistant" ? "AI" : "ME";
    this.classList.add(this.message.role);
    this.images.clear();
    this.images.add(...this.message.images);
    this.renderContent();
  }

  renderContent() {
    this.content.innerHTML = MD.render(this.message.content);
    if (!this.message.loading) this.renderBlockButtons();
  }

  renderBlockButtons() {
    const blocks = this.content.querySelectorAll("pre");
    for (const block of blocks) {
      const content = block.innerText;
      const button = createElement("button", {
        className: "material-icons",
        innerText: "content_copy",
        tooltip: "Copy code block",
        onclick: () => {
          navigator.clipboard.writeText(content);
          const tooltip = button.getAttribute("tooltip") || "";
          button.setAttribute("tooltip", "Copied");
          button.disabled = true;
          setTimeout(() => {
            button.setAttribute("tooltip", tooltip);
            button.disabled = false;
          }, 2000);
        },
      });
      block.append(button);
    }
  }
}

customElements.define("chat-message-element", ChatMessageElement);
