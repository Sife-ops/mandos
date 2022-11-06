import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTypedMutation } from "@mandos/graphql/urql";

export const useSignUpForm = () => {
  const nav = useNavigate();

  const [formIsValid, setFormIsValid] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [email, setEmail] = useState<string | null>(null);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [password, setPassword] = useState<string | null>(null);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [captchaImg, setCaptchaImg] = useState<string>("");
  const [captchaUuid, setCaptchaUuid] = useState<string>("");

  const [captcha, setCaptcha] = useState<string>("");
  const [captchaIsValid, setCaptchaIsValid] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const [captchaGetState, captchaGet] = useTypedMutation(() => {
    return {
      captchaGet: {
        captcha: true,
        uuid: true,
        ts: true,
      },
    };
  });

  const [captchaVerifyState, captchaVerify] = useTypedMutation(
    (vars: { uuid: string; captcha: string }) => {
      return {
        captchaVerify: [
          vars,
          {
            message: true,
          },
        ],
      };
    }
  );

  const [signUpState, signUp] = useTypedMutation(
    (vars: { email: string; username: string; password: string }) => {
      return {
        signUp: [vars],
      };
    }
  );

  const submit = () => {
    captchaVerify({ captcha, uuid: captchaUuid });
  };

  useEffect(() => {
    const { fetching, data, error } = captchaVerifyState;
    if (error) {
      console.error(error.message);
      if (error.message.includes("401")) {
        setFormError("incorrect code");
      } else if (error.message.includes("404")) {
        setFormError("code expired");
        captchaGet({});
      }
    } else if (!fetching && data) {
      signUp({
        email: email || "",
        username: username || "",
        password: password || "",
      });
    }
  }, [captchaVerifyState.data]);

  useEffect(() => {
    const { fetching, data, error } = signUpState;
    if (error) {
      console.error(error.message);
      setFormError(error.message.split("[GraphQL] ")[1]);
    } else if (!fetching && data) {
      console.log(data.signUp);
      nav(`/unconfirmed?email=${email}`);
    }
  }, [signUpState.data]);

  useEffect(() => {
    captchaGet({});
  }, []);

  useEffect(() => {
    const { fetching, data, error } = captchaGetState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      setCaptchaImg(data.captchaGet.captcha);
      setCaptchaUuid(data.captchaGet.uuid);
    }
  }, [captchaGetState.data]);

  useEffect(() => {
    validationEffect(
      email,
      () =>
        yup
          .string()
          .email()
          .required()
          .isValidSync(email),
      setEmailIsValid,
      setEmailError
    );
  }, [email]);

  useEffect(() => {
    validationEffect(
      username,
      () => username !== null && username.length > 0 && username.length < 24,
      setUsernameIsValid,
      setUsernameError
    );
  }, [username]);

  useEffect(() => {
    validationEffect(
      password,
      () =>
        yup
          .string()
          .min(8)
          .matches(/[0-9]/)
          .matches(/[!@#\$%\^\&*\)\(+=._-]/)
          .required()
          .isValidSync(password),
      setPasswordIsValid,
      setPasswordError
    );
  }, [password]);

  useEffect(() => {
    validationEffect(
      confirmPassword,
      () => confirmPassword === password,
      setConfirmPasswordIsValid,
      setConfirmPasswordError
    );
  }, [confirmPassword, password]);

  useEffect(() => {
    validationEffect(
      captcha,
      () =>
        yup
          .string()
          .min(6)
          .max(6)
          .required()
          .isValidSync(captcha),
      setCaptchaIsValid,
      setCaptchaError
    );
  }, [captcha]);

  useEffect(() => {
    // todo: determine if confirm password is needed
    if (emailIsValid && passwordIsValid && captchaIsValid && usernameIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [emailIsValid, passwordIsValid, captchaIsValid, usernameIsValid]);

  return {
    captcha,
    captchaError,
    captchaImg,
    confirmPassword,
    confirmPasswordError,
    confirmPasswordIsValid,
    email,
    emailError,
    emailIsValid,
    formError,
    formIsValid,
    password,
    passwordError,
    passwordIsValid,
    setCaptcha,
    setConfirmPassword,
    setEmail,
    setPassword,
    setPasswordError,
    setPasswordIsValid,
    setUsername,
    signUp,
    submit,
    username,
    usernameError,
  };
};

const isInitialized = (o: any) => o !== null;

const validationEffect = (
  stateVar: string | null,
  condition: () => boolean,
  setIsValidFn: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorFn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // todo: refactor logic for '.required()' schema?
  // if (!stateVar && isInitialized(stateVar)) {
  if (!stateVar) {
    setIsValidFn(false);
    if (isInitialized(stateVar)) {
      setErrorFn(true);
    } else {
      setErrorFn(false);
    }
  } else if (condition()) {
    setIsValidFn(true);
    setErrorFn(false);
  } else {
    setIsValidFn(false);
    setErrorFn(true);
  }
};
