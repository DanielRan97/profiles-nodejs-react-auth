import classes from "./chat.module.css";

const Chat = ({
  messageHandler,
  selectUser,
  sendMessageHandler,
  messagesList,
}) => {
  const messagesListDiv = () => {
    return Object.entries(messagesList).map(([key, value]) => (
      <div key={key}>
        <p>{value.message}</p>
      </div>
    ));
  };

  return (
    <div className={classes.chat}>
      <h3>{selectUser?.nickName}</h3>
      <div className={classes.messagesList}>{messagesListDiv()}</div>
      <div className={classes.chatActionsDiv}>
        <textarea maxLength={50} onChange={(e) => messageHandler(e.target.value)}></textarea>
        <button type="button" onClick={sendMessageHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
