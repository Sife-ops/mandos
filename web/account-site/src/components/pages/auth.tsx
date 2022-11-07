import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hook/auth-context";

export const Auth: React.FC<{ to: string }> = (p) => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const redirect = params.get("redirect");
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");

  const authContext = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    localStorage.setItem("redirect", redirect || "");
    localStorage.setItem("accessToken", accessToken || "");
    localStorage.setItem("refreshToken", refreshToken || "");
    authContext.setSignedIn(true);
    nav(p.to);
  }, []);

  return <div></div>;
};
