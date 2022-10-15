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
      // console.log(error.message.split("[GraphQL] ")[1]);
    } else if (!fetching && data) {
      console.log(data.signIn);
      // window.location.href = data.signIn;
    }
  }, [signInState.data]);

  return (
    <div>
      <img src={serviceLogoUrl} alt="logo" />
      {serviceTitle && <h3>{serviceTitle} Sign-In</h3>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          signIn({
            serviceId,
            email,
            password,
          });
        }}
      >
        <label>
          E-mail
          <input
            onChange={(e) => setEmail(e.target.value)}
            type={"email"}
            value={email}
          />
        </label>
        {/* <br /> */}

        <label>
          Password
          <Link to={"/forgot-password"}>Forgot password?</Link>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={"password"}
            value={password}
          />
        </label>
        {/* <br /> */}

        <button type={"submit"}>submit</button>
      </form>
      {/* todo: randomized text */}
      <p>
        What's wrong with you? <Link to={"/sign-up"}>Create an account</Link>.
      </p>
    </div>
  );
};
