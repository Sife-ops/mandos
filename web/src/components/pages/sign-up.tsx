import * as s from "../../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useSignUpForm } from "../../hook/sign-up-form";
import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const SignUp = () => {
  // const nav = useNavigate();
  const signUpForm = useSignUpForm();
  const serviceId = localStorage.getItem("serviceId");

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          signUpForm.submit();
          // const { email, password } = signUpForm;
          // signUpForm.signUp({
          //   email: email || "",
          //   password: password || "",
          // });
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
          // placeholder="Email"
          type={"email"}
          value={signUpForm.email || ""}
        />

        <span>Password</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setPassword(e.target.value)}
          // placeholder="Password"
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
          // placeholder="Password"
          // type={"password"}
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
