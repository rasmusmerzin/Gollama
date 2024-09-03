import { ActiveChatStore } from "./ActiveChatStore";
import { ChatMessage } from "./ChatMessage";
import { ChatStore } from "./ChatStore";

export class ChatService {
  static instance: ChatService | null = null;
  static get() {
    return this.instance || (ChatService.instance = new ChatService());
  }

  active_chat_store = ActiveChatStore.get();
  chat_store = ChatStore.get();

  pushMessage(content: string) {
    const { chat_id } = this.active_chat_store;
    const chat = this.chat_store.chats.get(<string>chat_id);
    if (!chat) return;
    chat.add(ChatMessage.from({ content }));
    this.chat_store.saveIndex();
    this.chat_store.saveChat(chat);
  }
}
