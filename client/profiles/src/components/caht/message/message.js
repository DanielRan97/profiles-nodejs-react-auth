import classes from "./message.module.css";

const Message = ({
  text,
  data: { senderId, userId, userData, selectUser },
}) => {
  const isMyMessage = senderId !== userId;
  const classType = isMyMessage ? classes.myMessage : classes.userMessage;

  return (
    <div className={`${classType} ${isMyMessage ? "myMessage" : "userMessage"}`}>
      <p className={classes.nickName} > {isMyMessage ? userData.nickName : selectUser.nickName}</p>
     <p className={classes.messageP}>{text}</p>
    </div>
  );
};

export default Message;
