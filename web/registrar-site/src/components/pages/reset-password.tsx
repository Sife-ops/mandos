import * as s from "../../index.css";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useQueryParam } from "@mandos/react/query-param";
import { useState, useEffect } from "react";

const passwordSchema = yup
  .string()
  .min(8)
  .matches(/[0-9]/)
  .matches(/[!@#\$%\^\&*\)\(+=._-]/)
  .required();

export const ResetPassword = () => {
  const nav = useNavigate();

  const { registrationToken } = useQueryParam(
    {
      registrationToken: { required: true },
    },
    "/error/404"
  );

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
    (vars: { password: string; registrationToken: string }) => {
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
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={(e) => {
          e.preventDefault();
          if (registrationToken) {
            resetPassword({ password, registrationToken });
          }
        }}
      >
        <h3 className={s.formContainer__form__header}>Reset Password</h3>

        <span>Password</span>
        <input
          className={s.formContainer__form__field}
          value={password}
          type={"password"}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={!passwordIsValid} type={"submit"}>
          Submit
        </button>
      </form>
    </div>
  );
};
