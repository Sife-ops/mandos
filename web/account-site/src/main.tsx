// import "./index.css";

import ReactDOM from "react-dom/client";
import { Account } from "./components/pages/account";
import { Auth } from "./components/pages/auth";
import { AuthContextProvider } from "./hook/auth-context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChangeAvatar } from "./components/pages/change-avatar";
import { ChangePassword } from "./components/pages/change-password";
import { ChangeUsername } from "./components/pages/change-username";
import { Footer } from "./components/footer";
import { PrivateRoutes } from "./components/private-routes";
import { authConfig } from "./urql";
import { authExchange } from "@urql/exchange-auth";
import { useAuthContext } from "./hook/auth-context";

import {
  Provider as UrqlProvider,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from "urql";

const urql = createClient({
  url: import.meta.env.VITE_API_URL + "/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange(authConfig),
    fetchExchange,
  ],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <UrqlProvider value={urql}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </UrqlProvider>
  // </React.StrictMode>
);

function App() {
  const auth = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <button onClick={() => auth.signOut()}>sign out</button>
              <PrivateRoutes errorTo="/error" />
            </div>
          }
        >
          <Route path="/account" element={<Account />} />
          <Route path="/change-avatar" element={<ChangeAvatar />} />
          <Route path="/change-username" element={<ChangeUsername />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route path="/auth" element={<Auth to="/account" />} />
        <Route path="/error" element={<div>Error! lol</div>} />
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
