import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

export default function AuthGuard(props: { children: any }) {
  const navigate = useNavigate();

  createEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirige si no hay token
    }
  });

  return <>{props.children}</>;
}
