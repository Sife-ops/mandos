import { useState, useEffect } from "react";
import { useQueryParam } from "../hook/query-param";
import { useTypedMutation } from "@mandos/graphql/urql";

export default function SignIn() {
  const [serviceId] = useQueryParam(["serviceId"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInState, signIn] = useTypedMutation(
    (vars: { serviceId: string; email: string; password: string }) => {
      return {
        signIn: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = signInState;
    if (!fetching && data && !error) {
      window.location.href = data.signIn;
    }
  }, [signInState.data]);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          signIn({
            serviceId: serviceId || "",
            email,
            password,
          });
        }}
      >
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
