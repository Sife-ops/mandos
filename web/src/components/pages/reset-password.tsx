// import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useState, useEffect } from "react";

// todo: password validation
// const emailSchema = yup
//   .string()
//   .email()
//   .required();

export const ResetPassword = () => {
  const nav = useNavigate();

  let signupToken: string;
  try {
    const [_] = useQueryParam(["signupToken"]);
    signupToken = _;
  } catch {
    nav("/error/404");
  }

  const [password, setPassword] = useState("");
  const [reset, setReset] = useState(false);
  //   const [emailIsValid, setEmailIsValid] = useState(false);

  //   useEffect(() => {
  //     if (emailSchema.isValidSync(email)) {
  //       setEmailIsValid(true);
  //     } else {
  //       setEmailIsValid(false);
  //     }
  //   }, [email]);

  const [resetPasswordState, resetPassword] = useTypedMutation(
    (vars: { password: string; signupToken: string }) => {
      return {
        resetPassword: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = resetPasswordState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      console.log(data);
      setReset(true);
    }
  }, [resetPasswordState.data]);

  return (
    <div>
      <h3>Reset Password</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          resetPassword({ password, signupToken });
          // todo: disable after submit
        }}
      >
        <label>
          Password
          <input
            value={password}
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          // disabled={!emailIsValid}
          type={"submit"}
        >
          Submit
        </button>
      </form>
      {reset && <div>Your password has been reset.</div>}
    </div>
  );
};
