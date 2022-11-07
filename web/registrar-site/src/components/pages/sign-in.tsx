import * as s from "../../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";

export const SignIn = () => {
  const nav = useNavigate();

  // todo: move to state
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const serviceId = params.get("serviceId");
  const redirect = params.get("redirect");

  useEffect(() => {
    if (!serviceId) {
      nav("/error/404");
    }
    localStorage.setItem("serviceId", serviceId || "");
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
          serviceId: serviceId || "",
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
      if (error.message.includes("not confirmed")) {
        nav(`/unconfirmed?email=${email}`);
      } else {
        setError(error.message.split("[GraphQL] ")[1]);
      }
    } else if (!fetching && data) {
      window.location.href =
        data.signIn + (redirect ? `&redirect=${redirect}` : "");
    }
  }, [signInState.data]);

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={async (e) => {
          e.preventDefault();
          signIn({
            serviceId: serviceId || "",
            email,
            password,
          });
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
            src={serviceLogoUrl}
            alt="logo"
          />
        </div>
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
          className={s.formContainer__form__field}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
          value={email}
        />

        <div className={s.formContainer__form__passwordLabel}>
          <span>Password</span>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <input
          className={s.formContainer__form__field}
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
