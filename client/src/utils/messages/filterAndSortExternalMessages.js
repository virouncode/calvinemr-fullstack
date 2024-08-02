export const getInboxMessagesExternal = (messages, userType, userId) => {
  //Les messages qui sont à destination de l'user et qui ne sont pas deleted
  let messagesToUserNonDeleted;

  if (userType === "staff") {
    messagesToUserNonDeleted = messages.filter(
      (message) =>
        message.to_staff_id &&
        message.to_staff_id === userId &&
        message.deleted_by_staff_id !== userId
    );
  } else {
    messagesToUserNonDeleted = messages.filter(
      (message) =>
        message.to_patients_ids
          .map(({ to_patient_infos }) => to_patient_infos.id)
          .includes(userId) && !message.deleted_by_patients_ids.includes(userId)
    );
  }
  return messagesToUserNonDeleted;
};

export const getSentMessagesExternal = (messages, userType, userId) => {
  //Les messages envoyés par le user non deleted

  let messagesSentByUserNonDeleted;
  if (userType === "staff") {
    messagesSentByUserNonDeleted = messages.filter(
      (message) =>
        message.from_staff_id &&
        message.from_staff_id === userId &&
        message.deleted_by_staff_id !== userId
    );
  } else {
    messagesSentByUserNonDeleted = messages.filter(
      (message) =>
        message.from_patient_id &&
        message.from_patient_id === userId &&
        !message.deleted_by_patients_ids.includes(userId)
    );
  }
  return messagesSentByUserNonDeleted;
};

export const getDeletedMessagesExternal = (messages, userType, userId) => {
  let messagesDeletedByUser;
  if (userType === "staff") {
    messagesDeletedByUser = messages.filter(
      (message) => message.deleted_by_staff_id === userId
    );
  } else {
    messagesDeletedByUser = messages.filter((message) =>
      message.deleted_by_patients_ids.includes(userId)
    );
  }
  return messagesDeletedByUser;
};

export const filterAndSortExternalMessages = (
  section,
  datas,
  userType,
  userId
) => {
  let newMessages = [];
  switch (section) {
    case "Received messages":
      newMessages = getInboxMessagesExternal(datas, userType, userId);
      break;
    case "Sent messages":
      newMessages = getSentMessagesExternal(datas, userType, userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessagesExternal(datas, userType, userId);
      break;
    default:
      break;
  }
  return newMessages;
};
