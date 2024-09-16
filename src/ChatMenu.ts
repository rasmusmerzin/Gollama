import { Chat } from "./Chat";
import { ChatRenameModal } from "./ChatRenameModal";
import { ChatService } from "./ChatService";
import { ContextMenuElement } from "./ContextMenuElement";
import { DialogueModal } from "./DialogueModal";

export interface ChatMenuParams {
  target?: HTMLElement;
  chat: Chat;
}

export function ChatMenu({ target, chat }: ChatMenuParams) {
  const chat_service = ChatService.get();
  new ContextMenuElement({
    target,
    options: [
      {
        name: "Rename",
        action: () => new ChatRenameModal(chat),
      },
      {
        name: "Delete",
        color: "var(--red)",
        action: () =>
          new DialogueModal({
            title_text: `Delete chat?`,
            body_text: `Are you sure you want to delete chat "${chat.title.trim()}"?`,
            submit_text: "Delete",
            color: "var(--red)",
            action: () => chat_service.deleteChat(chat.id),
          }),
      },
    ],
  });
}
