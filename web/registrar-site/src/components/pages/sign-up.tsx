import * as s from "../../index.css";
import { Link } from "react-router-dom";
import { useSignUpForm } from "../../hook/sign-up-form";

export const SignUp = () => {
  const signUpForm = useSignUpForm();
  const serviceId = localStorage.getItem("serviceId");

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          signUpForm.submit();
        }}
      >
        <h3 className={s.formContainer__form__header}>Sign Up</h3>

        {signUpForm.formError && (
          <div className={s.formContainer__form__error}>
            Error: {signUpForm.formError}.
          </div>
        )}

        {/* todo: use label tag */}
        <div className={s.formContainer__form__field}>
          <span>E-mail</span>
          <input
            onChange={(e) => signUpForm.setEmail(e.target.value)}
            type={"email"}
            value={signUpForm.email || ""}
          />
          {signUpForm.emailError && (
            <span className={s.formContainer__form__errorText}>
              Invalid e-mail address.
            </span>
          )}
        </div>

        <div className={s.formContainer__form__field}>
          <span>Username</span>
          <input
            onChange={(e) => signUpForm.setUsername(e.target.value)}
            type={"username"}
            value={signUpForm.username || ""}
          />
        </div>

        <div className={s.formContainer__form__field}>
          <span>Password</span>
          <input
            onChange={(e) => signUpForm.setPassword(e.target.value)}
            type={"password"}
            value={signUpForm.password || ""}
          />
          {signUpForm.passwordError && (
            <span className={s.formContainer__form__errorText}>
              Minimum 8 characters. Must contain one number and one special
              character.
            </span>
          )}
        </div>

        <div className={s.formContainer__form__field}>
          <img
            className={s.formContainer__form__field__img}
            src={signUpForm.captchaImg}
            alt="captcha"
          />
          <span>Enter the code shown above:</span>
          <input
            onChange={(e) => signUpForm.setCaptcha(e.target.value)}
            value={signUpForm.captcha || ""}
          />
        </div>

        <button type={"submit"} disabled={!signUpForm.formIsValid}>
          submit
        </button>

        {serviceId && (
          <p className={s.formContainer__form__p}>
            Already have an account?{" "}
            <Link to={`/sign-in?serviceId=${serviceId}`}>Sign in</Link>.
          </p>
        )}
      </form>
    </div>
  );
};
