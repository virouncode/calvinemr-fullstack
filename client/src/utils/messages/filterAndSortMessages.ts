import { MessageType, TodoType } from "../../types/api";

export const getInboxMessages = (messages: MessageType[], userId: number) => {
  return messages.filter(
    (message) =>
      message.to_staff_ids.includes(userId) &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};
export const getSentMessages = (messages: MessageType[], userId: number) => {
  return messages.filter(
    (message) =>
      message.from_id === userId &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};
export const getDeletedMessages = (messages: MessageType[], userId: number) => {
  return messages.filter((message) =>
    message.deleted_by_staff_ids?.includes(userId)
  );
};
export const filterAndSortMessages = (
  section: string,
  messages: (MessageType | TodoType)[],
  userId: number
) => {
  let newMessages: (MessageType | TodoType)[] = [];
  switch (section) {
    case "Received messages":
      newMessages = getInboxMessages(messages as MessageType[], userId);
      break;
    case "Sent messages":
      newMessages = getSentMessages(messages as MessageType[], userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessages(messages as MessageType[], userId);
      break;
    case "To-dos":
      newMessages = messages;
      break;
    default:
      break;
  }
  return newMessages;
};
