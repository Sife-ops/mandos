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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          // todo: responsivity
          // todo: percentage
          width: "300px",
        }}
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
          style={{
            borderRadius: "50%",
            width: "64px",
            height: "auto",
            alignSelf: "center",
          }}
          src={serviceLogoUrl}
          alt="logo"
        />
        {serviceTitle && (
          <h3
            style={{
              alignSelf: "center",
            }}
          >
            Sign in to {serviceTitle}
          </h3>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid red",
              background: "darkred",
              borderRadius: "10px"
            }}
          >
            Error: {error}.
          </div>
        )}

        {/* todo: use label tag */}
        <div>E-mail</div>
        <input
          style={{
            marginBottom: "1rem",
          }}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
          value={email}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Password</span>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </div>
        <input
          style={{
            marginBottom: "1rem",
          }}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
          value={password}
        />
        <button type={"submit"}>submit</button>
        {/* todo: randomized text */}
        <p
          style={{
            textAlign: "center",
          }}
        >
          What's wrong with you? <Link to={"/sign-up"}>Create an account</Link>.
        </p>
      </form>
    </div>
  );
};
