import classes from "../auth.module.css";

const AuthForm = ({
  formType,
  authFormState,
  inputHandler,
  setFormType,
  isFormValid,
  authHandler,
  setProfileImage
}) => {
  return (
    <div>
      <form className={classes.signUpForm}>
        <h1>{formType === "signUp" ? "SIGN UP" : "LOGIN"}</h1>
        {Object.entries(authFormState).map(([key, value]) => (
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
        {formType === "signUp" &&<div className={classes.signUpFormInputDiv}>
          <label>Profile Image (optional)</label>
          <input
          className={classes.input}
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>}
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
          onClick={() => authHandler()}
        >
          {formType === "signUp" ? "SIGN UP" : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
