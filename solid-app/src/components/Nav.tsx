import { useLocation, useNavigate } from "@solidjs/router";
import { isLoggedIn, logout } from "../components/authstore"; // Importar el estado global
import { createEffect, createSignal } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = createSignal(false); // Para evitar inconsistencias iniciales

  // Aseguramos que el cliente esté hidratado antes de tomar decisiones
  createEffect(() => {
    setHydrated(true); // Marcar como hidratado
  });

  const handleLogout = () => {
    logout(); // Cierra sesión globalmente
    navigate("/login"); // Redirige al login
  };

  const handleEditProfile = () => {
    navigate("/editprofile"); // Redirige a la página de edición de perfil
  };

  const handleLogin = () => {
    navigate("/login"); // Redirige a la página de login
  };

  const active = (path: string) =>
    path === location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/dashboard")} mx-1.5 sm:mx-6`}>
          <a href="/" class="font-bold">Dashboard</a>
        </li>
        <li class={`border-b-2 ${active("/clientes")} mx-1.5 sm:mx-6`}>
          <a href="/clientes" class="font-bold">Clientes</a>
        </li>
        <li class={`border-b-2 ${active("/rutas")} mx-1.5 sm:mx-6`}>
          <a href="/rutas" class="font-bold">Rutas</a>
        </li>
        <li class={`border-b-2 ${active("/pedidos")} mx-1.5 sm:mx-6`}>
          <a href="/pedidos" class="font-bold">Pedidos</a>
        </li>
        <li class={`border-b-2 ${active("/analitica")} mx-1.5 sm:mx-6`}>
          <a href="/analitica" class="font-bold">Analítica</a>
        </li>

        {/* Botones para Configuración, Login y Cerrar Sesión */}
        <li class="ml-auto flex items-center space-x-4">
          <Show when={hydrated() && isLoggedIn()}>
            {/* Botón Configuración */}
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleEditProfile}
            >
              Configuración
            </button>
            {/* Botón Cerrar Sesión */}
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </Show>
          <Show when={hydrated() && !isLoggedIn()}>
            {/* Botón Iniciar Sesión */}
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
          </Show>
        </li>
      </ul>
    </nav>
  );
}
