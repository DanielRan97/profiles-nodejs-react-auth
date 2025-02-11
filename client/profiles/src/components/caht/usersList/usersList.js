import { useEffect, useContext } from "react";
import classes from "./usersList.module.css";
import { ChatContext } from "../../../contexts/chatContext";

const UsersList = ({ usersList, selectUserHandler, userData }) => {
  const { unreadCounts, fetchUnreadCounts } = useContext(ChatContext);

  useEffect(() => {
    if(userData && usersList.length > 0) fetchUnreadCounts(usersList, userData._id);
  }, [fetchUnreadCounts, userData, usersList]);

  const usersListDiv = usersList.map((user) => (
    <div
      key={user._id}
      className={classes.usersListDiv}
      onClick={() => selectUserHandler(user)}
    >
      <img
        className={classes.userProfileImg}
        src={`http://localhost:4000/auth${user.profileImage}`}
        alt={`${user.nickName}'s profile`}
      />
      <b className={classes.userNickName}>{user.nickName}</b>
      {unreadCounts[user._id] > 0 && (
        <span className={classes.unReadMessages}>{unreadCounts[user._id]}</span>
      )}
    </div>
  ));

  return (
    <div className={classes.usersList}>
      <h2 className={classes.usersListHeader}>Online Users:</h2>
      {usersList.length > 0 ? usersListDiv : <p>No online users</p>}
    </div>
  );
};

export default UsersList;
