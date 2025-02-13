import { useRef, useEffect } from "react";
import classes from "./chat.module.css";
import Message from "./message/message";
import { socket } from "../../socket/socket";
import { markMessagesAsRead } from "../../axios/chatAxios";

const Chat = ({
  messageHandler,
  selectUser,
  sendMessageHandler,
  messagesList,
  message,
  messageError,
  userData,
  selectUserHandler,
  empytChatAlert,
}) => {
  const contentRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messagesList changes
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messagesList]);

  useEffect(() => {
    socket.on("new-message", async () => {
      if (selectUser !== null) {
        markMessagesAsRead(selectUser._id, userData._id);
      }
    });
  }, [selectUser, userData]);

  const MessagesListDiv = () => {
    return Object.entries(messagesList).map(([key, value], index) => (
      <div key={index} className={classes.message}>
        <Message
          text={value.message}
          date={value.createdAt}
          data={{
            senderId: value.senderId,
            userId: selectUser._id,
            userData,
            selectUser,
          }}
        />
      </div>
    ));
  };

  const handleMesggaeSend = () => {
    textAreaRef.current.focus();
    sendMessageHandler();
  };

  return (
    <div className={classes.chat}>
      <div className={classes.chatHeader}>
        <div></div>
        <h3>{selectUser?.nickName}</h3>
        <button
          className={classes.closeChatButton}
          type="button"
          onClick={() => {
            selectUserHandler(selectUser, userData);
          }}
        >
          X
        </button>
      </div>

      <div className={classes.messagesList} ref={contentRef}>
        {empytChatAlert === "" ? MessagesListDiv() : <p>{empytChatAlert}</p>}
      </div>
      {messageError && <p className={classes.messageError}>{messageError}</p>}
      <div className={classes.chatActionsDiv}>
        <textarea
          ref={textAreaRef}
          value={message}
          maxLength={50}
          onChange={(e) => messageHandler(e.target.value)}
        ></textarea>
        <button
          type="submit"
          onClick={() => handleMesggaeSend()}
          disabled={!message.trim().length > 0}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
