import { useState, useEffect } from "react";
import classes from "../auth.module.css";
import { sendCode, verifyCode } from "../../../axios/authAxios";
const VerificationForm = ({ email, setAuthSuccess, setFormError }) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    let isSent = false;
    const sendVerificationCode = async () => {
      if (!isSent) {
        try {
          const response = await sendCode(email);
          setAuthSuccess(response.data.message);
          isSent = true;
        } catch (error) {
          setFormError(error || "Error sending code");
        }
      }
    };

    sendVerificationCode();

    return () => {
      isSent = true; // Cleanup to ensure no double requests
    };
  }, [email, setAuthSuccess, setFormError]);

  const verifyCodeHandler = async (email, code) => {
    try {
      const response = await verifyCode(email, code);
      setAuthSuccess(response.data.message);
    } catch (error) {
      setFormError(error || "Error verifying code");
    }
  };

  return (
    <div>
      <form form className={classes.signUpForm}>
        <h1>Verification</h1>
        <div className={classes.signUpFormInputDiv}>
          <label>
            You have received an email with a code for verification.
            <input
              className={classes.input}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></input>
            <button
              className={classes.signUpFormButton}
              type="button"
              onClick={() => verifyCodeHandler(email, code)}
            >
              Verify
            </button>
          </label>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;
