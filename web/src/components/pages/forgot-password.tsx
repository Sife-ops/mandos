import * as s from "../../index.css";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useState, useEffect } from "react";

const emailSchema = yup
  .string()
  .email()
  .required();

export const ForgotPassword = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);

  useEffect(() => {
    if (emailSchema.isValidSync(email)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
  }, [email]);

  const [sendResetEmailState, sendResetEmail] = useTypedMutation(
    (vars: { email: string }) => {
      return {
        sendResetEmail: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = sendResetEmailState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      console.log(data);
      nav("/success/email-resent");
    }
  }, [sendResetEmailState.data]);

  return (
    <div className={s.formContainer}>
      <form
        className={s.formContainer__form}
        onSubmit={(e) => {
          e.preventDefault();
          sendResetEmail({ email });
        }}
      >
        <h3 className={s.formContainer__form__header}>Send Reset E-mail</h3>

        <span>E-mail</span>
        <input
          className={s.formContainer__form__input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={!emailIsValid} type={"submit"}>
          Send E-mail
        </button>
      </form>
    </div>
  );
};
