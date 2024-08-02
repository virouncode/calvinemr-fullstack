export const onMessageUnreadExternal = (
  message,
  user,
  setUser,
  userAccessLevel,
  userId
) => {
  if (message.route !== "UNREAD EXTERNAL") return;
  if (
    userAccessLevel === user.access_level &&
    message.content.userId === userId
  ) {
    switch (message.action) {
      case "update":
        if (userAccessLevel === "staff") {
          setUser({
            ...user,
            unreadMessagesExternalNbr: user.unreadMessagesExternalNbr + 1,
            unreadNbr: user.unreadNbr + 1,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              unreadMessagesExternalNbr: user.unreadMessagesExternalNbr + 1,
              unreadNbr: user.unreadNbr + 1,
            })
          );
        } else if (userAccessLevel === "patient") {
          setUser({
            ...user,
            unreadNbr: user.unreadNbr + 1,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              unreadNbr: user.unreadNbr + 1,
            })
          );
        }
        break;
      default:
        break;
    }
  }
};
