import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as UrqlProvider, createClient } from "urql";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "./components/pages/sign-in";
import { SignUp } from "./components/pages/sign-up";
import { Unconfirmed } from "./components/pages/unconfirmed";
import { Error } from "./components/pages/error";
// import "./index.css";

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
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/unconfirmed" element={<Unconfirmed />} />
        <Route path="/error/:error" element={<Error />} />
        <Route path="*" element={<Navigate to="/sign-up" />} />
      </Routes>
    </BrowserRouter>
  );
}
