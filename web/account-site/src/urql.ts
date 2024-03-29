import axios from "axios";
import jwt_decode from "jwt-decode";
import { AuthConfig } from "@urql/exchange-auth";
import { makeOperation } from "urql";

export const authConfig: AuthConfig<{ accessToken: string }> = {
  willAuthError: ({ authState }) => {
    if (!authState) return true;

    const decoded = jwt_decode<{ exp: number }>(authState.accessToken);
    const now = Date.now() / 1000;
    const secsRemaining = decoded.exp - now;
    console.log(`session time remaining: ${secsRemaining} seconds`);
    if (secsRemaining < 10) return true;

    return false;
  },

  getAuth: async ({ authState }) => {
    if (!authState) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) return { accessToken };
      return null;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/refresh", {
        refreshToken,
      });
      const { success, accessToken } = res.data;
      if (success) {
        localStorage.setItem("accessToken", accessToken);
        return { accessToken };
      }
    }

    localStorage.clear();
    window.location.reload();
    return null;
  },

  addAuthToOperation: ({ authState, operation }: any) => {
    if (!authState || !authState.accessToken) {
      return operation;
    }

    const fetchOptions =
      typeof operation.context.fetchOptions === "function"
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: authState.accessToken,
        },
      },
    });
  },

  didAuthError: ({ error }) => {
    return error.response.status === 401;
  },
};
