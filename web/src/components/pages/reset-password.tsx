import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useState, useEffect } from "react";

const passwordSchema = yup
  .string()
  .min(8)
  .matches(/[0-9]/)
  .matches(/[!@#\$%\^\&*\)\(+=._-]/)
  .required();

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
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  useEffect(() => {
    if (passwordSchema.isValidSync(password)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  }, [password]);

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
      nav("/success/password-reset");
    }
  }, [resetPasswordState.data]);

  return (
    <div>
      <h3>Reset Password</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          resetPassword({ password, signupToken });
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
        <button disabled={!passwordIsValid} type={"submit"}>
          Submit
        </button>
      </form>
    </div>
  );
};
