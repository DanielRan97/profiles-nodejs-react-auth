import { useState } from "react";
import classes from "./authForm.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";

const AuthForm = () => {
  const navigate = useNavigate();
  const { authContextLogin, authContextRegister } = useContext(AuthContext);
  const [formType, setFormType] = useState("signUp");
  const [formError, setFormError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [signUpFormState, setSignUpFormState] = useState({
    fullName: {
      value: "",
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
      value: "",
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
      value: "",
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
      value: "",
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
    const { min, max } = signUpFormState[key].valid || {};
    const error =
      min && max && (val.length < min || val.length > max)
        ? `${signUpFormState[key].name} length must be between ${min} and ${max} characters.`
        : signUpFormState[key].valid?.validator &&
          !signUpFormState[key].valid.validator(val)
        ? `${signUpFormState[key].name} is not valid.`
        : "";

    setSignUpFormState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: val,
        error: error,
      },
    }));
  };
  const isFormValid = () => {
    return Object.values(signUpFormState).every((field) => {
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
        fullName: signUpFormState.fullName.value,
        nickName: signUpFormState.nickName.value,
        email: signUpFormState.email.value,
        password: signUpFormState.password.value,
      };
      try {
        const res = await authContextRegister(user);
        setAuthSuccess(
          `${signUpFormState.fullName.value} signed up successfully. You can now login.`
        );
        if (res) {
          setFormType("login");
        }
      } catch (error) {
        setFormError(
          error.response.data.error.message || "Sign Up failed."
        );
      }
    } else {
      const user = {
        nickName: signUpFormState.nickName.value,
        password: signUpFormState.password.value,
      };
      try {
        await authContextLogin(user);
        navigate("/profile");
      } catch (error) {
        console.error(error.response);

        setFormError(
          error.response.data.message || "Login failed."
        );
      }
    }
  };

  return (
    <div>
      <form className={classes.signUpForm}>
        <h1>{formType === "signUp" ? "SIGN UP" : "LOGIN"}</h1>
        {Object.entries(signUpFormState).map(([key, value]) => (
          <div key={key} className={classes.signUpFormInputDiv}>
            {value.target.includes(formType) && (
              <label>
                {value.name}
                <input
                  className={value.error ? classes.invalidInput : classes.input}
                  minLength={value.valid?.min}
                  maxLength={value.valid?.max}
                  type={value.type}
                  value={value.value}
                  onChange={(e) => inputHandler(e.target.value, key)}
                />
              </label>
            )}
            {value.error && (
              <p className={classes.signUpFormInputError}>{value.error}</p>
            )}
          </div>
        ))}
        {formError && (
          <p className={classes.signUpFormInputError}>{formError}</p>
        )}
        {authSuccess && (
          <p className={classes.authSuccessMessage}>{authSuccess}</p>
        )}
        <p
          className={classes.switchFormP}
          onClick={() =>
            setFormType(formType === "signUp" ? "login" : "signUp")
          }
        >
          {formType === "signUp"
            ? "Already have an account? Login here."
            : "Don't have an account yet? Sign up here."}
        </p>
        <button
          disabled={!isFormValid()}
          className={classes.signUpFormButton}
          type="button"
          onClick={authHandler}
        >
          {formType === "signUp" ? "SIGN UP" : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
