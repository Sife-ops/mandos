import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as UrqlProvider, createClient } from "urql";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/sign-in";
import { Error } from "./pages/error";
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
        <Route path="/error/:error" element={<Error />} />
        <Route path="*" element={<Navigate to="/sign-in" />} />
      </Routes>
    </BrowserRouter>
  );
}
