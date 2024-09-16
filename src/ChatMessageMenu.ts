import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { ContextMenuElement } from "./ContextMenuElement";

export interface ChatMessageMenuParams {
  target?: HTMLElement;
  message: ChatMessage;
}

export function ChatMessageMenu({ target, message }: ChatMessageMenuParams) {
  const chat_service = ChatService.get();
  new ContextMenuElement({
    target,
    options: [
      {
        name: "Copy Text",
        action: () => navigator.clipboard.writeText(message.content),
      },
      {
        name: "Delete Message",
        color: "var(--red)",
        action: () => chat_service.deleteMessage(message.id),
      },
    ],
  });
}
