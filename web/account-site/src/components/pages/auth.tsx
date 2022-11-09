import React, { useEffect } from "react";
import { useAuthContext } from "../../hook/auth-context";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "@mandos/react/query-param";

export const Auth: React.FC<{ to: string; errorTo: string }> = (p) => {
  const { redirect, accessToken, refreshToken } = useQueryParam(
    {
      redirect: { required: false },
      accessToken: { required: true },
      refreshToken: { required: true },
    },
    p.errorTo
  );

  const authContext = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    if (redirect) {
      localStorage.setItem("redirect", redirect);
    }
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      authContext.setSignedIn(true);
      nav(p.to);
    }
  }, [redirect, accessToken, refreshToken]);

  return <div></div>;
};
