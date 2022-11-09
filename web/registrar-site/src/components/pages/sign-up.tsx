import * as s from "../../index.css";
import { Link } from "react-router-dom";
import { useSignUp } from "./sign-up-hook";

export const SignUp = () => {
  const page = useSignUp();
  const serviceId = localStorage.getItem("serviceId");

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          page.submit();
        }}
      >
        <h3 className={s.formContainer__form__header}>Sign Up</h3>

        {page.formError && (
          <div className={s.formContainer__form__error}>
            Error: {page.formError}.
          </div>
        )}

        {/* todo: use label tag */}
        <div className={s.formContainer__form__field}>
          <span>E-mail</span>
          <input
            onChange={(e) => page.setEmail(e.target.value)}
            type={"email"}
            value={page.email || ""}
          />
          {page.emailError && (
            <span className={s.formContainer__form__errorText}>
              Invalid e-mail address.
            </span>
          )}
        </div>

        <div className={s.formContainer__form__field}>
          <span>Username</span>
          <input
            onChange={(e) => page.setUsername(e.target.value)}
            type={"username"}
            value={page.username || ""}
          />
        </div>

        <div className={s.formContainer__form__field}>
          <span>Password</span>
          <input
            onChange={(e) => page.setPassword(e.target.value)}
            type={"password"}
            value={page.password || ""}
          />
          {page.passwordError && (
            <span className={s.formContainer__form__errorText}>
              Minimum 8 characters. Must contain one number and one special
              character.
            </span>
          )}
        </div>

        <div className={s.formContainer__form__field}>
          <img
            className={s.formContainer__form__field__img}
            src={page.captchaImg}
            alt="captcha"
          />
          <span>Enter the code shown above:</span>
          <input
            onChange={(e) => page.setCaptcha(e.target.value)}
            value={page.captcha || ""}
          />
        </div>

        <button type={"submit"} disabled={!page.formIsValid}>
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
