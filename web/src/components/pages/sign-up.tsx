import * as s from "../../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useSignUpForm } from "../../hook/sign-up-form";
import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const SignUp = () => {
  const nav = useNavigate();
  const signUpForm = useSignUpForm();
  const serviceId = localStorage.getItem("serviceId");

  const [error, setError] = useState<string | null>(null);

  const [signUpState, signUp] = useTypedMutation(
    (vars: { email: string; password: string }) => {
      return {
        signUp: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = signUpState;
    if (error) {
      console.error(error.message);
      setError(error.message.split("[GraphQL] ")[1]);
    } else if (!fetching && data) {
      console.log(data.signUp);
      nav(`/unconfirmed?email=${signUpForm.email}`);
    }
  }, [signUpState.data]);

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          const { email, password } = signUpForm;
          signUp({
            email: email || "",
            password: password || "",
          });
        }}
      >
        <h3 className={s.formContainer__form__header}>Sign Up</h3>

        {error && (
          <div className={s.formContainer__form__error}>Error: {error}.</div>
        )}

        {/* todo: use label tag */}
        <span>E-mail</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setEmail(e.target.value)}
          placeholder="Email"
          type={"email"}
          value={signUpForm.email || ""}
        />

        <span>Password</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => signUpForm.setPassword(e.target.value)}
          placeholder="Password"
          type={"password"}
          value={signUpForm.password || ""}
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
