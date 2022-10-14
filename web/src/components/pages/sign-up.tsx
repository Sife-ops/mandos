import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const SignUp = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const serviceId = localStorage.getItem("serviceId");

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

      {serviceId && (
        <p>
          Already have an account?{" "}
          <Link to={`/sign-in?serviceId=${serviceId}`}>Sign in</Link>.
        </p>
      )}
    </div>
  );
};
