# integration steps

## MANDOS

#### create service record

example:
```json
{
 "pk": "$mandos#serviceid_bookmarks",
 "sk": "$service_1",
 "accessTokenSecret": "secret",
 "redirect": "http://bookmarks.goettsch.xyz/auth",
 "refreshTokenSecret": "secret",
 "serviceId": "bookmarks",
 "title": "Bookmarks",
 "__edb_e__": "Service",
 "__edb_v__": "1"
}
```

#### upload service logo

in `<env>-mandos-web-logobucket`:
```
bookmarks.png
```

## SERVICE

#### environment variables

```
MANDOS_URL=<registrar site url>
MANDOS_API_URL=<registrar api url>
```

#### frontend auth route

`auth.tsx`:
```typescript
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useAuthContext } from "../../hook/auth-context";

export const Auth: React.FC = () => {
  const [accessToken, refreshToken] = useQueryParam([
    "accessToken",
    "refreshToken",
  ]);

  const authContext = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    authContext.setSignedIn(true);
    nav("/home");
  }, []);

  return <div></div>;
};
```

#### graphql client configuration

urql auth-exchange:
```typescript
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
```

#### custom authorizer

```typescript
import axios from "axios";
import { Config } from "@serverless-stack/node/config";
import { decode } from "jsonwebtoken";

export const handler = async (event: any) => {
  try {
    const accessToken = event.headers.authorization;

    const url = `${Config.MANDOS_API_URL}/verify`;
    const res = await axios.post(url, { accessToken });

    if (res.data.success) {
      const { email, userId } = decode(accessToken) as {
        email: string;
        userId: string;
      };

      return {
        isAuthorized: true,
        context: {
          user: {
            email,
            userId,
          },
        },
      };
    } else {
      throw new Error(`mandos: ${res.data.message}`);
    }
  } catch (e) {
    console.log(e);
    return {
      isAuthorized: false,
    };
  }
};
```

#### refresh proxy

```typescript
import axios from "axios";
import { Config } from "@serverless-stack/node/config";
import { z } from "zod";

const eventSchema = z.object({
  refreshToken: z.string(),
});

// todo: api password?
export const handler = async (event: any) => {
  try {
    const { refreshToken } = eventSchema.parse(JSON.parse(event.body));

    const url = `${Config.MANDOS_API_URL}/refresh`;
    const res = await axios.post(url, { refreshToken });

    return res.data;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e,
    };
  }
};
```
