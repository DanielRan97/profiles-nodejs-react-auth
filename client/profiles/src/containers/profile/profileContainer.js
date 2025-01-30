import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import Profile from "../../components/profile/profile";
import UsersList from "../../components/profile/usersList/usersList";
import classes from "./profileContainer.module.css";
const ProfileContainer = () => {
  const { userData, usersList } = useContext(AuthContext);
  
  return (
    <div className={classes.profileContainer}>
    <Profile userData={userData} />
    {usersList.length >= 1 && <UsersList usersList={usersList}/>}
    </div>
  );
};

export default ProfileContainer;