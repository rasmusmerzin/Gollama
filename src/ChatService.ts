import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { ChatStore } from "./ChatStore";
import { OllamaService } from "./OllamaService";
import { RouteStore } from "./RouteStore";

export class ChatService {
  static instance: ChatService | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ChatService();
    return this.instance;
  }

  route_store = RouteStore.get();
  chat_store = ChatStore.get();
  ollama_service = OllamaService.get();

  deleteChat(chat_id: string) {
    if (this.route_store.chat_id === chat_id) this.route_store.set("new-chat");
    this.chat_store.delete(chat_id);
  }

  deleteMessage(message_id: string) {
    const { chat_id } = this.route_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.delete(message_id);
  }

  async ask(message: ChatMessage | null) {
    const { chat_id } = this.route_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    if (message) chat.add(message);
    if (chat.title === "New Chat" && !chat.generating_title)
      this.generateChatTitle(chat);
    await this.generateResponse(chat);
  }

  async generateResponse(chat: Chat) {
    const history = Array.from(chat.messages.values());
    const message = ChatMessage.from({ role: "assistant" });
    message.controller = new AbortController();
    message.loading = true;
    message.done = false;
    chat.add(message);
    try {
      await this.ollama_service.chatStreamingResponse(
        chat.model,
        history,
        (msg) => message.push(msg),
        message.controller.signal,
      );
      message.setDone(true);
    } finally {
      message.setLoading(false);
    }
  }

  async generateChatTitle(chat: Chat) {
    chat.generating_title = true;
    const history = Array.from(chat.messages.values());
    const content = "Write only one single short two-word title for this chat.";
    history.push(ChatMessage.from({ content }));
    const response = await this.ollama_service.chatResponse(
      chat.model,
      history,
    );
    const [first_line] = response.content.split("\n");
    if (chat.title === "New Chat")
      chat.setTitle(first_line.replaceAll(/['"]/g, ""));
    chat.generating_title = false;
  }
}
