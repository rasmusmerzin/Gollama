import { ActiveChatStore } from "./ActiveChatStore";
import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { ChatStore } from "./ChatStore";
import { OllamaService } from "./OllamaService";

export class ChatService {
  static instance: ChatService | null = null;
  static get() {
    if (this.instance) return this.instance;
    this.instance = new ChatService();
    return this.instance;
  }

  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();
  ollama_service = OllamaService.get();

  deleteChat(chat_id: string) {
    if (this.active_chat_store.chat_id === chat_id)
      this.active_chat_store.set(null);
    this.chat_store.delete(chat_id);
  }

  deleteMessage(message_id: string) {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.delete(message_id);
  }

  async ask(message: ChatMessage) {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.add(message);
    const promises = [this.generateResponse(chat)];
    if (chat.title === "New Chat") promises.push(this.generateChatTitle(chat));
    await Promise.all(promises);
  }

  async generateResponse(chat: Chat) {
    const history = Array.from(chat.messages.values());
    const message = ChatMessage.from({ role: "assistant" });
    message.setLoading(true);
    chat.add(message);
    try {
      await this.ollama_service.chatStreamingResponse(
        chat.model,
        history,
        (msg) => message.push(msg),
      );
    } finally {
      message.setLoading(false);
    }
  }

  async generateChatTitle(chat: Chat) {
    const history = Array.from(chat.messages.values());
    const content = "Write only one single short two-word title for this chat.";
    history.push(ChatMessage.from({ content }));
    const response = await this.ollama_service.chatResponse(
      chat.model,
      history,
    );
    const [first_line] = response.content.split("\n");
    chat.setTitle(first_line.replaceAll(/['"]/g, ""));
  }
}
