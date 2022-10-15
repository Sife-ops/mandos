import * as s from "../../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";

export const SignIn = () => {
  const nav = useNavigate();

  let serviceId: string;
  try {
    const [_] = useQueryParam(["serviceId"]);
    serviceId = _;
  } catch {
    nav("/error/404");
  }

  useEffect(() => {
    localStorage.setItem("serviceId", serviceId);
  }, []);

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceLogoUrl, setServiceLogoUrl] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [serviceQuery] = useTypedQuery({
    query: {
      service: [
        {
          // @ts-ignore
          serviceId,
        },
        {
          title: true,
          logoUrl: true,
        },
      ],
    },
  });

  useEffect(() => {
    const { fetching, data, error } = serviceQuery;
    if (error) {
      nav("/error/404");
    } else if (!fetching && data) {
      setServiceTitle(data.service.title);
      setServiceLogoUrl(data.service.logoUrl);
    }
  }, [serviceQuery.data]);

  const [signInState, signIn] = useTypedMutation(
    (vars: { serviceId: string; email: string; password: string }) => {
      return {
        signIn: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = signInState;
    if (error) {
      console.error(error.message);
      setError(error.message.split("[GraphQL] ")[1]);
    } else if (!fetching && data) {
      console.log(data.signIn);
      // window.location.href = data.signIn;
    }
  }, [signInState.data]);

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          signIn({
            serviceId,
            email,
            password,
          });
        }}
      >
        <img
          className={s.formContainer__form__img}
          src={serviceLogoUrl}
          alt="logo"
        />
        {serviceTitle && (
          <h3 className={s.formContainer__form__header}>
            Sign in to {serviceTitle}
          </h3>
        )}

        {error && (
          <div className={s.formContainer__form__error}>Error: {error}.</div>
        )}

        {/* todo: use label tag */}
        <span>E-mail</span>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
          value={email}
        />

        <div className={s.formContainer__form__passwordLabel}>
          <span>Password</span>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <input
          className={s.formContainer__form__input}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
          value={password}
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
