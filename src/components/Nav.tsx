import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, createEffect, Show} from "solid-js";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);

  // Efecto para sincronizar el estado con el token
  createEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Actualiza el estado según el token
    console.log("Estado actualizado de isLoggedIn:", isLoggedIn());
  });

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    setIsLoggedIn(false); // Cambia el estado reactivo
    navigate("/login"); // Redirige al login
  };

  const handleLogin = () => {
    navigate("/login"); // Redirige a la página de login
  };

  const handleEditProfile = () => {
    navigate("/editprofile"); // Redirige a la página de edición de perfil
  };

  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/rutas")} mx-1.5 sm:mx-6`}>
          <a href="/rutas">Rutas</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <li class={`border-b-2 ${active("/dashboard")} mx-1.5 sm:mx-6`}>
          <a href="/dashboard">Dashboard</a>
        </li>

        {/* Botón que cambia entre Editar Perfil y Login */}
        <li class="ml-auto">
          <button
            class={`${
              isLoggedIn()
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded mr-2`}
            onClick={() => (isLoggedIn() ? handleEditProfile() : handleLogin())}
          >
            {isLoggedIn() ? "Editar Perfil" : "Iniciar Sesión"}
          </button>

          {/* Botón de Cerrar Sesión */}
          <Show when={isLoggedIn()}>
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </Show>
        </li>
      </ul>
    </nav>
  );
}
