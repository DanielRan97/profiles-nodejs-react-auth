import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import AuthForm from "./authForm/authForm";
import VerificationForm from "../auth/verificationForm/verificationForm";
import classes from "./auth.module.css";

const Auth = () => {
  const navigate = useNavigate();
  const { authContextLogin, authContextRegister } = useContext(AuthContext);
  const [formType, setFormType] = useState("signUp");
  const [formError, setFormError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [authFormState, setAuthFormState] = useState({
    fullName: {
      value: "daniel",
      type: "text",
      name: "Full Name",
      valid: {
        min: 3,
        max: 20,
      },
      error: "",
      target: "signUp",
    },
    email: {
      value: "daniel.daniel.ran@gmail.com",
      type: "email",
      name: "Email",
      valid: {
        validator: function (email) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        },
      },
      error: "",
      target: "signUp",
    },
    nickName: {
      value: "dani",
      type: "text",
      name: "Nick Name",
      valid: {
        min: 3,
        max: 20,
      },
      error: "",
      target: "login signUp",
    },
    password: {
      value: "aaAA11!!",
      type: "password",
      name: "Password",
      valid: {
        min: 6,
        max: 20,
      },
      error: "",
      target: "login signUp",
    },
  });

  const inputHandler = (val, key) => {
    const { min, max } = authFormState[key].valid || {};
    const error =
      min && max && (val.length < min || val.length > max)
        ? `${authFormState[key].name} length must be between ${min} and ${max} characters.`
        : authFormState[key].valid?.validator &&
          !authFormState[key].valid.validator(val)
        ? `${authFormState[key].name} is not valid.`
        : "";

    setAuthFormState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: val,
        error: error,
      },
    }));
  };

  useEffect(() => {
    setFormError("");
  }, [formType]);

  const isFormValid = () => {
    return Object.values(authFormState).every((field) => {
      if (!field.target.includes(formType)) {
        return true;
      }
      return field.error === "" && field.value.trim() !== "";
    });
  };

  const authHandler = async () => {
    setAuthSuccess("");
    setFormError("");
    if (formType === "signUp") {
      const user = {
        fullName: authFormState.fullName.value,
        nickName: authFormState.nickName.value,
        email: authFormState.email.value,
        profileImage: profileImage,
        password: authFormState.password.value,
      };
      try {
        const res = await authContextRegister(user);
        setAuthSuccess(
          `${authFormState.fullName.value} signed up successfully. You can now login.`
        );
        if (res) {
          //setVerified(true);
          setFormType("login");
        }
      } catch (error) {
        setFormError(error);
      }
    } else {
      const user = {
        nickName: authFormState.nickName.value,
        password: authFormState.password.value,
      };
      try {
        await authContextLogin(user);
        navigate("/profile");
      } catch (error) {
        setFormError(error.response?.data?.message || "Login failed.");
      }
    }
  };

  const form = verified ? (
    <VerificationForm
      setFormError={(message) => setFormError(message)}
      setAuthSuccess={(message) => setAuthSuccess(message)}
      email={authFormState.email.value}
    />
  ) : (
    <AuthForm
      isFormValid={isFormValid}
      setFormType={setFormType}
      authFormState={authFormState}
      authHandler={authHandler}
      inputHandler={inputHandler}
      formError={formError}
      authSuccess={authSuccess}
      formType={formType}
      setProfileImage={(img) => setProfileImage(img)}
    />
  );

  return (
    <div>
      {form}
      {formError && <p className={classes.signUpFormInputError}>{formError}</p>}
      {authSuccess && (
        <p className={classes.authSuccessMessage}>{authSuccess}</p>
      )}
    </div>
  );
};

export default Auth;
