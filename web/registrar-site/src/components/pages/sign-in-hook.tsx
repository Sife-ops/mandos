import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTypedMutation, useTypedQuery } from "@mandos/graphql/urql";
import { useQueryParam } from "@mandos/react/query-param";

export const useSignIn = () => {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [serviceTitle, setServiceTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const [serviceQuery] = useTypedQuery({
    query: {
      service: [
        {
          serviceId: serviceId || "",
        },
        {
          title: true,
        },
      ],
    },
  });

  useEffect(() => {
    const { fetching, data, error } = serviceQuery;
    if (error) {
      nav("/error/404");
    } else if (!fetching && data) {
      // todo: alternative - get signed logo url from s3
      setServiceTitle(data.service.title);
      setLoading(false);
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
    email,
    error,
    loading,
    password,
    serviceId,
    serviceTitle,
    setEmail,
    setPassword,
    signIn,
  };
};
