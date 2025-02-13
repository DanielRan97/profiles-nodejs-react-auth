import Auth from "../../components/auth/auth";
import classes from "./AuthContainer.module.css";
const AuthContainer = () => {

    return(
        <div className={classes.AuthContainer}> 
            <Auth />
        </div>
    );
};

export default AuthContainer;