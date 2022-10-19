// import "./index.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider as UrqlProvider, createClient } from "urql";

import { Auth } from "./components/pages/auth";
import { Footer } from "./components/footer";
import { AuthContextProvider } from "./hook/auth-context";
import { PrivateRoutes } from "./components/private-routes";

const urql = createClient({
  url: import.meta.env.VITE_GRAPHQL_URL,
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
          <Route path="/ree" element={<div>ree!</div>} />
        </Route>
        <Route path="/auth" element={<Auth to="/ree" />} />
        <Route path="/error" element={<div>Error! lol</div>} />
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
