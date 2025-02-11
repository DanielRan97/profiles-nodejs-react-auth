import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/authContext";
import Profile from "../../components/profile/profile";
import UsersList from "../../components/caht/usersList/usersList";
import classes from "./profileContainer.module.css";
import Chat from "../../components/caht/chat";
import { ChatContext } from "../../contexts/chatContext";

const ProfileContainer = () => {
  const { userData, usersList } = useContext(AuthContext);
  const {
    messagesList,
    message,
    messageError,
    empytChatAlert,
    listenAndgetNewMessage,
    selectUser,
    sendMessageHandler,
    messageHandler,
    selectUserHandler,
  } = useContext(ChatContext);

  useEffect(() => {
    listenAndgetNewMessage(userData, selectUser);
  }, [userData, selectUser, listenAndgetNewMessage]);

  return (
    <div className={classes.profileContainer}>
      <Profile userData={userData} />
      <div className={classes.chatArea}>
        <UsersList
          userData={userData}
          usersList={usersList}
          messagesList={messagesList}
          selectUserHandler={(user) => selectUserHandler(user, userData)}
        />
        {Object.keys(selectUser).length !== 0 ? (
          <Chat
            selectUser={selectUser}
            messagesList={messagesList}
            messageHandler={(m) => messageHandler(m)}
            sendMessageHandler={() => sendMessageHandler(userData)}
            message={message}
            messageError={messageError}
            userData={userData}
            empytChatAlert={empytChatAlert}
          />
        ) : <h3>No selected chat</h3>}
        <div></div>
      </div>
    </div>
  );
};

export default ProfileContainer;
