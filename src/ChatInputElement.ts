import "./ChatInputElement.css";
import { Element } from "./Element";
import { createElement } from "./createElement";
import { ChatService } from "./ChatService";
import { ChatMessage } from "./ChatMessage";

export class ChatInputElement extends Element {
  chat_service = ChatService.get();

  text_input = createElement("input", {
    type: "text",
    placeholder: "Write a message...",
  });
  file_input = createElement("input", {
    type: "file",
    accept: "image/*",
    multiple: true,
  });
  text_container = createElement("div");
  send_button = createElement("button", { innerText: "Send" });

  constructor() {
    super();
    this.text_container.append(this.text_input, this.send_button);
    this.append(this.file_input, this.text_container);
    this.send_button.onclick = this.send.bind(this);
    this.text_input.onkeydown = this.keydown.bind(this);
  }

  set disabled(value: boolean) {
    this.file_input.disabled = value;
    this.text_input.disabled = value;
    this.send_button.disabled = value;
  }

  focus() {
    this.text_input.focus();
  }

  keydown({ key }: KeyboardEvent) {
    if (key === "Enter") this.send();
  }

  async send() {
    const content = this.text_input.value;
    const images = await this.getImages();
    const message = ChatMessage.from({ content, images });
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
