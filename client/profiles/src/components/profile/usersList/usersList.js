import classes from "./usersList.module.css";

const UsersList = ({ usersList, selectUserHandler }) => {
  const usersListDiv = usersList.map((user, index) => {
    return (
      <div key={index} className={classes.usersListDiv} onClick={() => selectUserHandler(user)}>
        <img
        className={classes.userProfileImg}
          src={`http://localhost:4000/auth${user.profileImage}`}
          alt="User profile img"
        />
        <b className={classes.userNickName}>{user.nickName}</b>
      </div>
    );
  });

  return (
    <div className={classes.usersList}>
      <h2 className={classes.usersListHeader}>Online Users:</h2>
      {usersListDiv}
    </div>
  );
};

export default UsersList;
