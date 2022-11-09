import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";
import { useQueryParam } from "@mandos/react/query-param";

export const useSignIn = () => {
  const nav = useNavigate();

  const { serviceId, redirect } = useQueryParam(
    {
      serviceId: { required: true },
      redirect: { required: false },
    },
    "/error/404"
  );

  useEffect(() => {
    localStorage.setItem("serviceId", serviceId || "");
  }, []);

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceLogoUrl, setServiceLogoUrl] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [serviceQuery] = useTypedQuery({
    query: {
      service: [
        {
          serviceId: serviceId || "",
        },
        {
          title: true,
          logoUrl: true,
        },
      ],
    },
  });

  useEffect(() => {
    const { fetching, data, error } = serviceQuery;
    if (error) {
      nav("/error/404");
    } else if (!fetching && data) {
      setServiceTitle(data.service.title);
      setServiceLogoUrl(data.service.logoUrl);
    }
  }, [serviceQuery.data]);

  const [signInState, signIn_] = useTypedMutation(
    (vars: { serviceId: string; email: string; password: string }) => {
      return {
        signIn: [vars],
      };
    }
  );

  const signIn = () => {
    signIn_({
      serviceId: serviceId || "",
      email,
      password,
    });
  };

  useEffect(() => {
    const { fetching, data, error } = signInState;
    if (error) {
      console.error(error.message);
      if (error.message.includes("not confirmed")) {
        nav(`/unconfirmed?email=${email}`);
      } else {
        setError(error.message.split("[GraphQL] ")[1]);
      }
    } else if (!fetching && data) {
      window.location.href = `${data.signIn}${
        redirect ? `&redirect=${redirect}` : ""
      }`;
    }
  }, [signInState.data]);

  return {
    serviceId,
    serviceTitle,
    serviceLogoUrl,
    email,
    setEmail,
    password,
    setPassword,
    error,
    signIn,
  };
};
