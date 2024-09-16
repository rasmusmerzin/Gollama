import "./ChatInputElement.css";
import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ImageListElement } from "./ImageListElement";

export class ChatInputElement extends Element {
  chat_service = ChatService.get();
  file_input = createElement("input", {
    type: "file",
    accept: "image/*",
    multiple: true,
    onchange: this.filechange.bind(this),
  });

  text_input: HTMLInputElement;
  file_button: HTMLButtonElement;
  send_button: HTMLButtonElement;
  images = new ImageListElement({ max_count: 5 });

  constructor() {
    super();
    this.append(
      this.images,
      createElement("div", {}, [
        (this.text_input = createElement("input", {
          id: "input",
          type: "text",
          placeholder: "Write a message...",
          onkeydown: this.keydown.bind(this),
        })),
        (this.file_button = createElement("button", {
          innerText: "📂",
          title: "Add images",
          onclick: () => this.file_input.click(),
          oncontextmenu: () => {
            this.file_input.value = "";
            this.filechange();
          },
        })),
        (this.send_button = createElement("button", {
          innerText: "➤",
          className: "primary",
          title: "Send prompt and fetch response",
          onclick: this.send.bind(this),
        })),
      ]),
    );
  }

  set disabled(value: boolean) {
    this.text_input.disabled = value;
    this.file_button.disabled = value;
    this.send_button.disabled = value;
  }

  keydown({ key }: KeyboardEvent) {
    if (key === "Enter") this.send();
  }

  async filechange() {
    this.images.clear();
    this.images.add(...(await this.getImages()));
    this.dispatchEvent(new Event("filechange"));
  }

  async send() {
    const content = this.text_input.value;
    const images = await this.getImages();
    const message =
      content || images.length ? ChatMessage.from({ content, images }) : null;
    this.file_input.value = "";
    this.text_input.value = "";
    this.filechange();
    await this.chat_service.ask(message);
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
