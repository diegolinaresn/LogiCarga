import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import AuthGuard from "./components/login/AuthGuard";
import "./app.css";
import Home from "./routes";

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <AuthGuard>
          <Nav />  
          <Suspense>{props.children}</Suspense>
          </AuthGuard>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
