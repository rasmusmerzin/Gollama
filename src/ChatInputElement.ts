import "./ChatInputElement.css";
import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { DialogueModal } from "./DialogueModal";
import { Element } from "./Element";
import { ImageListElement } from "./ImageListElement";
import { createElement } from "./createElement";

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

  constructor(readonly chat: Chat) {
    super();
    this.append(
      this.images,
      createElement("div", {}, [
        (this.text_input = createElement("input", {
          id: "input",
          type: "text",
          placeholder: "Write a message...",
          onkeydown: this.keydown.bind(this),
          oninput: this.render.bind(this),
        })),
        (this.file_button = createElement("button", {
          innerText: "attach_file",
          className: "material-icons",
          tooltip: "Add images",
          onclick: () => this.file_input.click(),
          oncontextmenu: () => {
            this.file_input.value = "";
            this.filechange();
          },
        })),
        (this.send_button = createElement("button", {
          innerText: "send",
          className: "material-icons primary",
          onclick: this.send.bind(this),
        })),
      ]),
    );
    this.render();
  }

  set disabled(value: boolean) {
    this.text_input.disabled = value;
    this.file_button.disabled = value;
    this.send_button.disabled = value;
  }

  keydown({ key }: KeyboardEvent) {
    if (key === "Enter") this.send();
  }

  async send() {
    const message = await this.getMessage();
    this.clear();
    const action = () => this.chat_service.ask(message);
    if (message || this.chat.last_message?.role === "user") action();
    else
      new DialogueModal({
        title_text: "Empty Message",
        body_text:
          "Generate a response without a prompt? This is generally undesired.",
        action,
      });
  }

  clear() {
    this.file_input.value = "";
    this.text_input.value = "";
    this.filechange();
    this.render();
  }

  render() {
    this.text_input.value = this.text_input.value.trimStart();
    const { value } = this.text_input;
    const tooltip = value
      ? "Send prompt and generate a response"
      : "Generate a response";
    this.send_button.setAttribute("tooltip", tooltip);
    this.send_button.innerText = value ? "send" : "contact_support";
  }

  async filechange() {
    this.images.clear();
    this.images.add(...(await this.getImages()));
    this.dispatchEvent(new Event("filechange"));
  }

  async getMessage() {
    const content = this.text_input.value;
    const images = await this.getImages();
    if (!content && !images.length) return null;
    return ChatMessage.from({ content, images });
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
