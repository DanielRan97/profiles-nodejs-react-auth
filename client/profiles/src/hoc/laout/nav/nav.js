import classes from "./nav.module.css";
import { AuthContext } from "../../../contexts/authContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "../../../assets/images/defoultUserImg.avif";

const Nav = () => {
  const { isLoggedIn, authContextLogout, userData } = useContext(AuthContext);
  const [profileImg, setProfileImg] = useState(defaultUserImg);

  useEffect(() => {
    if (userData?.profileImage) {
      setProfileImg(`http://localhost:4000/auth${userData.profileImage}`);
    } else {
      setProfileImg(defaultUserImg);
    }
  }, [userData?.profileImage]);

  const navigate = useNavigate();
  const logOtHandler = () => {
    authContextLogout();
    navigate("/auth");
  };

  return (
    <div className={classes.nav}>
      <h1 className={classes.navTitle}>Profiles</h1>
      {isLoggedIn && (
        <button className={classes.logOutButton} onClick={logOtHandler}>
          Log Out
        </button>
      )}
      {userData && (
        <img
          src={profileImg}
          alt="User profile"
          className={classes.profileImg}
        />
      )}
    </div>
  );
};

export default Nav;
