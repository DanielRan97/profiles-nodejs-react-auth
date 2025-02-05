import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import Profile from "../../components/profile/profile";
import UsersList from "../../components/profile/usersList/usersList";
import classes from "./profileContainer.module.css";
import Chat from "../../components/caht/chat";
import { getMessagesHistory, sendMessage } from "../../axios/caht";
import { socket } from "../../socket/socket";

const ProfileContainer = () => {
  const { userData, usersList } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [selectUser, setSelectUser] = useState({});
  const [messageError, setMessageError] = useState("");
  const [messagesList, setMessagesList] = useState({});

  const selectUserHandler = async (user) => {
    if (selectUser === user) {
      setSelectUser({});
      setMessagesList({})
    } else {
      setSelectUser(user);
      try {
        const res = await getMessagesHistory(user._id);
        setMessagesList(res.data);
      } catch (error) {
        alert(error);
      }
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await sendMessage(userData._id, selectUser._id, message);
      socket.on("new-message", (newMsg) => {
        console.log(newMsg);
        setMessagesList((prev) => [...prev, newMsg]);
        socket.off("private-message");
        socket.off("new-message");
      });
      setMessagesList((prev) => [...prev, res]);
    } catch (error) {
      console.log(error);
      setMessageError(error.message);
    }
  };

  const messageHandler = (message) => {
    setMessage(message);
  };

  return (
    <div className={classes.profileContainer}>
      <Profile userData={userData} />
      <div className={classes.chatArea}>
        {Array.isArray(usersList) && usersList.length > 0 && (
          <UsersList
            usersList={usersList}
            selectUserHandler={(user) => selectUserHandler(user)}
          />
        )}
        {Object.keys(selectUser).length !== 0 && (
          <Chat
            selectUser={selectUser}
            messagesList={messagesList}
            messageHandler={(m) => messageHandler(m)}
            sendMessageHandler={() => sendMessageHandler()}
          />
        )}
        <div></div>
      </div>
    </div>
  );
};

export default ProfileContainer;
