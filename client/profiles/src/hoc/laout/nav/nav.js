import classes from "./nav.module.css";
import { AuthContext } from "../../../contexts/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const Nav = () => {

  const { isLoggedIn, authContextLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logOtHandler = () => {
    authContextLogout();
    navigate("/auth");
  };

  return (
    <div className={classes.nav}>
      <h1 className={classes.navTitle}>Profiles</h1>
      {isLoggedIn && <button className={classes.logOutButton} onClick={logOtHandler}>Log Out</button>}
    </div>
  );
};

export default Nav;
