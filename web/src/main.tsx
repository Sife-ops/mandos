// import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider as UrqlProvider, createClient } from "urql";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Confirm } from "./components/pages/confirm";
import { Error } from "./components/pages/error";
import { ForgotPassword } from "./components/pages/forgot-password";
import { ResetPassword } from "./components/pages/reset-password";
import { SignIn } from "./components/pages/sign-in";
import { SignUp } from "./components/pages/sign-up";
import { Success } from "./components/pages/success";
import { Unconfirmed } from "./components/pages/unconfirmed";

const urql = createClient({
  url: import.meta.env.VITE_GRAPHQL_URL,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <UrqlProvider value={urql}>
    <App />
  </UrqlProvider>
  // </React.StrictMode>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/error/:error" element={<Error />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/success/:effect" element={<Success />} />
        <Route path="/unconfirmed" element={<Unconfirmed />} />

        <Route path="*" element={<Navigate to="/sign-up" />} />
      </Routes>
    </BrowserRouter>
  );
}
