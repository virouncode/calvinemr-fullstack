export const getInboxMessages = (messages, userId) => {
  return messages.filter(
    (message) =>
      message.to_staff_ids.includes(userId) &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};
export const getSentMessages = (messages, userId) => {
  return messages.filter(
    (message) =>
      message.from_id === userId &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};
export const getDeletedMessages = (messages, userId) => {
  return messages.filter((message) =>
    message.deleted_by_staff_ids?.includes(userId)
  );
};
export const filterAndSortMessages = (section, datas, userId) => {
  let newMessages = [];
  switch (section) {
    case "Received messages":
      newMessages = getInboxMessages(datas, userId);
      break;
    case "Sent messages":
      newMessages = getSentMessages(datas, userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessages(datas, userId);
      break;
    case "To-dos":
      newMessages = datas;
      break;
    default:
      break;
  }
  return newMessages;
};
