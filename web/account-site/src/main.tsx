// import "./index.css";

import ReactDOM from "react-dom/client";
import { Auth } from "./components/pages/auth";
import { AuthContextProvider } from "./hook/auth-context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Footer } from "./components/footer";
import { PrivateRoutes } from "./components/private-routes";
import { authConfig } from "./urql";
import { authExchange } from "@urql/exchange-auth";
import { Dev } from "./components/pages/dev";

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoutes errorTo="/error" />}>
          <Route path="/dev" element={<Dev />} />
        </Route>
        <Route path="/auth" element={<Auth to="/dev" />} />
        <Route path="/error" element={<div>Error! lol</div>} />
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
