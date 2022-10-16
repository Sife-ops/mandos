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
        <span>E-mail</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setEmail(e.target.value)}
          type={"email"}
          value={signUpForm.email || ""}
        />

        <span>Password</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setPassword(e.target.value)}
          type={"password"}
          value={signUpForm.password || ""}
        />

        <img style={{
          marginBottom: "1rem"
        }} src={signUpForm.captchaImg} alt="captcha" />
        <span>Enter the code shown above:</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setCaptcha(e.target.value)}
          value={signUpForm.captcha || ""}
        />

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
