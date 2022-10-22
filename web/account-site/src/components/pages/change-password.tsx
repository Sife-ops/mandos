import * as yup from "yup";
import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const nav = useNavigate();

  const [password, setPassword] = useState<string>("");

  const [changePasswordState, changePassword] = useTypedMutation(
    (vars: { password: string }) => {
      return {
        changePassword: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = changePasswordState;
    if (!fetching && data && !error) {
      nav("/dev");
    }
  }, [changePasswordState.data]);

  return (
    <div>
      <input
        placeholder="password"
        value={password}
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <span>Must contain one number and one special character.</span>
      <br />

      <button
        disabled={
          !yup
            .string()
            .min(8)
            .matches(/[0-9]/)
            .matches(/[!@#\$%\^\&*\)\(+=._-]/)
            .required()
            .isValidSync(password)
        }
        onClick={() => {
          changePassword({ password });
          //   if (username) {
          //     changeUsername({ username });
          //   }
        }}
      >
        Save
      </button>
    </div>
  );
};
