import "./ChatInputElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ChatService } from "./ChatService";
import { ChatMessage } from "./ChatMessage";

export class ChatInputElement extends Element {
  static instance: ChatInputElement | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ChatInputElement();
    return this.instance;
  }

  chat_service = ChatService.get();

  file_input: HTMLInputElement;
  text_input: HTMLInputElement;
  send_button: HTMLButtonElement;
  file_container: HTMLElement;

  constructor() {
    super();
    this.append(
      createElement("div", {}, [
        (this.file_container = createElement("div")),
        (this.file_input = createElement("input", {
          type: "file",
          accept: "image/*",
          multiple: true,
          onchange: this.filechange.bind(this),
        })),
      ]),
      createElement("div", {}, [
        (this.text_input = createElement("input", {
          id: "input",
          type: "text",
          placeholder: "Write a message...",
          onkeydown: this.keydown.bind(this),
        })),
        (this.send_button = createElement("button", {
          innerText: "➤",
          className: "primary",
          onclick: this.send.bind(this),
        })),
      ]),
    );
  }

  set disabled(value: boolean) {
    this.file_input.disabled = value;
    this.text_input.disabled = value;
    this.send_button.disabled = value;
  }

  keydown({ key }: KeyboardEvent) {
    if (key === "Enter") this.send();
  }

  async filechange() {
    for (const child of Array.from(this.file_container.children))
      child.remove();
    for (const image of await this.getImages())
      this.file_container.append(
        createElement("img", {
          src: "data:;base64," + image,
          alt: "Image",
        }),
      );
    this.dispatchEvent(new Event("filechange"));
  }

  async send() {
    const content = this.text_input.value;
    const images = await this.getImages();
    const message =
      content || images.length ? ChatMessage.from({ content, images }) : null;
    await this.chat_service.ask(message);
    this.file_input.value = "";
    this.text_input.value = "";
  }

  async getImages() {
    const images = new Array<string>();
    const files = this.file_input.files;
    if (!files) return images;
    for (const file of files) {
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const [, base64] = (reader.result as string).split(";base64,");
      images.push(base64);
    }
    return images;
  }
}

customElements.define("chat-input-element", ChatInputElement);
