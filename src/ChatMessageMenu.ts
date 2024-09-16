import { ChatMessage } from "./ChatMessage";
import { ChatService } from "./ChatService";
import { ContextMenuElement, ContextMenuOption } from "./ContextMenuElement";

export interface ChatMessageMenuParams {
  target?: HTMLElement;
  message: ChatMessage;
}

export function ChatMessageMenu({ target, message }: ChatMessageMenuParams) {
  const chat_service = ChatService.get();
  const options = new Array<ContextMenuOption>();
  if (message.loading)
    options.push({
      name: "Abort",
      color: "var(--alert)",
      action: () => message.controller?.abort(),
    });
  else
    options.push(
      {
        name: "Copy Text",
        action: () => navigator.clipboard.writeText(message.content),
      },
      {
        name: "Delete Message",
        color: "var(--alert)",
        action: () => chat_service.deleteMessage(message.id),
      },
    );
  new ContextMenuElement({ target, options });
}
