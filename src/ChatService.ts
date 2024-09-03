import { ActiveChatStore } from "./ActiveChatStore";
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

  deleteMessage(message_id: string) {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.delete(message_id);
    this.chat_store.saveIndex();
    this.chat_store.saveChat(chat);
  }

  pushMessage(content: string) {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.add(ChatMessage.from({ content }));
    this.chat_store.saveIndex();
    this.chat_store.saveChat(chat);
  }

  async generateResponse() {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    const history = Array.from(chat.messages);
    const message = ChatMessage.from({ role: "assistant" });
    message.setLoading(true);
    chat.add(message);
    try {
      const response = await this.ollama_service.generateChatResponse(
        chat.model,
        history,
      );
      message.pushContent(response.content);
    } finally {
      message.setLoading(false);
      this.chat_store.saveIndex();
      this.chat_store.saveChat(chat);
    }
  }
}
