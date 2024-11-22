import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import AuthGuard from "./components/login/AuthGuard";
import "./app.css";
import Home from "./routes/index";

export default function App() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Router
        root={(props) => (
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
    </>
  );
}
