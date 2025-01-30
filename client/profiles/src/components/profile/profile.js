import classes from "./profile.module.css";
import ProfileImg from "./profileimg/profileimg";

const Profile = ({ userData }) => {
  
  return (
    <div className={classes.profile}>
        <ProfileImg user={userData}/>
      <h2 className={classes.profileTitle}>
        Welcome, {userData?.fullName || "User"}!
      </h2>
    </div>
  );
};

export default Profile;
