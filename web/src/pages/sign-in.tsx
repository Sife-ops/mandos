import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../hook/query-param";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";

export default function SignIn() {
  const nav = useNavigate();

  let serviceId: string;
  try {
    const [serviceId_] = useQueryParam(["serviceId"]);
    serviceId = serviceId_;
  } catch {
    nav("/error/404");
  }

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceLogo, setServiceLogo] = useState("");

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
          logo: true,
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
      setServiceLogo(data.service.logo);
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
      console.log(error.message);
    } else if (!fetching && data) {
      window.location.href = data.signIn;
    }
  }, [signInState.data]);

  return (
    <div>
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
        <img src={serviceLogo} alt="logo" />
        {serviceTitle && <h3>{serviceTitle} Sign-In</h3>}

        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type={"email"}
          value={email}
        />
        <br />

        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type={"password"}
          value={password}
        />
        <br />

        <button type={"submit"}>submit</button>
      </form>
    </div>
  );
}
