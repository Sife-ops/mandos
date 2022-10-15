import { useNavigate, Link } from "react-router-dom";
import { useSignUpForm } from "../../hook/sign-up-form";
import { useEffect } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const SignUp = () => {
  const nav = useNavigate();
  const signUpForm = useSignUpForm();
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
      nav(`/unconfirmed?email=${signUpForm.email}`);
    }
  }, [signUpState.data]);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { email, password } = signUpForm;
          signUp({
            email: email || "",
            password: password || "",
          });
        }}
      >
        <h3>Sign Up</h3>

        <input
          onChange={(e) => signUpForm.setEmail(e.target.value)}
          placeholder="Email"
          type={"email"}
          value={signUpForm.email || ""}
        />
        <br />

        <input
          onChange={(e) => signUpForm.setPassword(e.target.value)}
          placeholder="Password"
          type={"password"}
          value={signUpForm.password || ""}
        />
        <br />

        <button type={"submit"} disabled={!signUpForm.formIsValid}>
          submit
        </button>
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
