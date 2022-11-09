import * as s from "../../index.css";
import { Link } from "react-router-dom";
import { useSignIn } from "./sign-in-hook";

export const SignIn = () => {
  const page = useSignIn();
  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          page.signIn();
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            alignSelf: "center",
          }}
        >
          <img
            className={s.formContainer__form__img}
            src={page.serviceLogoUrl}
            alt="logo"
          />
        </div>
        {page.serviceTitle && (
          <h3 className={s.formContainer__form__header}>
            Sign in to {page.serviceTitle}
          </h3>
        )}

        {page.error && (
          <div className={s.formContainer__form__error}>
            Error: {page.error}.
          </div>
        )}

        {/* todo: use label tag */}
        <span>E-mail</span>
        <input
          className={s.formContainer__form__field}
          onChange={(e) => page.setEmail(e.target.value)}
          type={"email"}
          value={page.email}
        />

        <div className={s.formContainer__form__passwordLabel}>
          <span>Password</span>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <input
          className={s.formContainer__form__field}
          onChange={(e) => page.setPassword(e.target.value)}
          type={"password"}
          value={page.password}
        />
        <button type={"submit"}>submit</button>
        {/* todo: randomized text */}
        <p className={s.formContainer__form__p}>
          What's wrong with you? <Link to={"/sign-up"}>Create an account</Link>.
        </p>
      </form>
    </div>
  );
};
