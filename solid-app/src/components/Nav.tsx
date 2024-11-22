import { useLocation, useNavigate } from "@solidjs/router";
import { isLoggedIn, logout } from "../components/authstore"; // Global authentication state
import { createEffect, createSignal, Show } from "solid-js";
import logo from "./logo.png";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = createSignal(false); // Prevent initial inconsistencies
  const [isMenuOpen, setMenuOpen] = createSignal(false); // Handle menu toggle for mobile

  createEffect(() => {
    setHydrated(true); // Mark as hydrated
  });

  const handleLogout = () => {
    logout(); // Log out globally
    navigate("/login"); // Redirect to login
  };

  const handleEditProfile = () => {
    navigate("/editprofile"); // Redirect to profile edit page
  };

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  const active = (path: string) =>
    path === location.pathname
      ? "border-b-2 border-sky-600"
      : "border-b-2 border-transparent hover:border-sky-600";

  return (
    <nav class="bg-sky-700 p-4">
      <div class="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div class="flex items-center">
          <img src={logo} alt="LogiCarga Logo" class="h-10 mr-3" />
        </div>

        {/* Hamburger Menu (for mobile) */}
        <button
          class="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!isMenuOpen())}
        >
          ☰
        </button>

        {/* Desktop and Mobile Menu */}
        <div
          class={`${
            isMenuOpen() ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-6 text-white font-bold w-full lg:w-auto`}
        >
          <ul class="lg:flex lg:space-x-6 mt-4 lg:mt-0">
            <li>
              <a href="/" class={`pb-1 ${active("/")}`}>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/clientes" class={`pb-1 ${active("/clientes")}`}>
                Clientes
              </a>
            </li>
            <li>
              <a href="/rutas" class={`pb-1 ${active("/rutas")}`}>
                Rutas
              </a>
            </li>
            <li>
              <a href="/pedidos" class={`pb-1 ${active("/pedidos")}`}>
                Pedidos
              </a>
            </li>
            <li>
              <a href="/analitica" class={`pb-1 ${active("/analitica")}`}>
                Analítica
              </a>
            </li>
          </ul>

          {/* Login / Configuración Buttons */}
          <div class="flex items-center space-x-4 mt-4 lg:mt-0 lg:ml-6">
            <Show when={hydrated() && isLoggedIn()}>
              {/* Configuración Button */}
              <button
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleEditProfile}
              >
                Configuración
              </button>
              {/* Cerrar Sesión Button */}
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </Show>
            <Show when={hydrated() && !isLoggedIn()}>
              {/* Iniciar Sesión Button */}
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </button>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
