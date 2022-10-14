import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";

export const SignUp = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      // console.log(error.message.split("[GraphQL] ")[1]);
    } else if (!fetching && data) {
      console.log(data.signUp);
      // window.location.href = data.signIn;
    }
  }, [signUpState.data]);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          signUp({
            email,
            password,
          });
        }}
      >
        {/* <img src={serviceLogoUrl} alt="logo" />
        {serviceTitle && <h3>{serviceTitle} Sign-In</h3>} */}
        <h3>Sign Up</h3>

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
};
