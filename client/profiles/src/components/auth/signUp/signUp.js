import { useState } from "react";
import classes from "./signUp.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";

const SignUp = () => {
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
      terget: "signUp",
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
      terget: "login signUp",
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
      terget: "login signUp",
    },
  });

  // Handle input change and validation
  const inputHandler = (val, key) => {
    const { min, max } = signUpFormState[key].valid;

    const error =
      val.length < min || val.length > max
        ? `${signUpFormState[key].name} length must be between ${min} and ${max} characters.`
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

  // Check if the form is valid
  const isFormValid = () => {
    return Object.values(signUpFormState).every((field) => {
      if (formType !== "signUp" && !field.terget.includes("login signUp")) {
        return true;
      }
      return field.error === "" && field.value.trim() !== "";
    });
  };

  const authHandler = async () => {
    setAuthSuccess("");
    setFormError("");
    if (formType === "signUp") {
      let user = {
        fullName: signUpFormState.fullName.value,
        nickName: signUpFormState.nickName.value,
        password: signUpFormState.password.value,
      };
      try {
        const res = await authContextRegister(user);
        setAuthSuccess(
          `${signUpFormState.fullName.value} sign up successfully,You can now login`
        );
        if (res) {
          console.log(res);
          setFormType("login");
        }
      } catch (error) {
        console.log(error);
        setFormError(error.response.data.message);
      }
    } else {
      let user = {
        nickName: signUpFormState.nickName.value,
        password: signUpFormState.password.value,
      };
      try {
        await authContextLogin(user);
        navigate("/profile");
      } catch (error) {
        setFormError(error.response.data.message);
      }
    }
  };

  let signUpForm = (
    <form className={classes.signUpForm}>
      <h1>{formType === "signUp" ? "SIGN UP" : "LOGIN"}</h1>
      {Object.entries(signUpFormState).map(([key, value]) => {
        return (
          <div key={key} className={classes.signUpFormInputDiv}>
            {value.terget.includes(formType) && (
              <label>
                {value.name}
                <input
                  className={
                    value.error !== "" ? classes.invalidInput : classes.input
                  }
                  minLength={value.valid.min}
                  maxLength={value.valid.max}
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
        );
      })}
      {formError !== "" && (
        <p className={classes.signUpFormInputError}>{formError}</p>
      )}
      {authSuccess !== "" && (
        <p className={classes.authSuccessMessage}>{authSuccess}</p>
      )}
      <p
        className={classes.switchFormP}
        onClick={() => setFormType(formType === "signUp" ? "login" : "signUp")}
      >
        {formType === "signUp"
          ? "Already have account? Login here"
          : "Dont have account yet? Sign Up here"}
      </p>
      <button
        disabled={!isFormValid()}
        className={classes.signUpFormButton}
        type="button"
        onClick={() => authHandler()}
      >
        {formType === "signUp" ? "SIGN UP" : "LOGIN"}
      </button>
    </form>
  );

  return <div>{signUpForm}</div>;
};

export default SignUp;
