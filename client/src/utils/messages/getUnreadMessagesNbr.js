export const getUnreadMessagesNbr = (messages, userId) => {
  let unreadMessagesNbr = 0;
  if (messages.length) {
    //messages non lus dont je suis l'un des destinataires
    unreadMessagesNbr = messages.reduce((accumulator, currentValue) => {
      if (
        currentValue.to_staff_ids.includes(userId) &&
        !currentValue.read_by_staff_ids.includes(userId)
      ) {
        return accumulator + 1;
      } else return accumulator;
    }, 0);
  }
  return unreadMessagesNbr;
};

export const getUnreadMessagesExternalNbr = (messages, userType, userId) => {
  let unreadMessagesExternalNbr = 0;
  let messagesForUser;

  if (userType === "staff") {
    messagesForUser = messages.filter(
      (message) => message.to_staff_id && message.to_staff_id === userId
    );
    if (messagesForUser.length) {
      unreadMessagesExternalNbr = messagesForUser.reduce(
        (accumulator, currentValue) => {
          if (currentValue.read_by_staff_id !== userId) {
            return accumulator + 1;
          } else {
            return accumulator;
          }
        },
        0
      );
    }
  } else {
    messagesForUser = messages.filter((message) =>
      message.to_patients_ids
        .map(({ to_patient_infos }) => to_patient_infos.patient_id)
        .includes(userId)
    );
    if (messagesForUser.length) {
      unreadMessagesExternalNbr = messagesForUser.reduce(
        (accumulator, currentValue) => {
          if (!currentValue.read_by_patients_ids.includes(userId)) {
            return accumulator + 1;
          } else {
            return accumulator;
          }
        },
        0
      );
    }
  }
  return unreadMessagesExternalNbr;
};
