import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { login, logout, user } from "../components/authstore";
import UserProfile from "~/components/UserProfile";

// Función para obtener los datos del usuario
const fetchUserData = async (token: string) => {
  if (typeof window === "undefined") return null; // Prevenir ejecución en el servidor

  try {
    const response = await fetch("http://127.0.0.1:5005/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en fetchUserData:", err);
    return null;
  }
};

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5005/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email(),
          password: password(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }

      const data = await response.json();
      const userData = await fetchUserData(data.access_token);

      if (!userData) {
        throw new Error("Error al obtener los datos del usuario");
      }

      login(data.access_token, userData); // Actualiza el estado global
      navigate("/"); // Redirige al inicio
    } catch (err: any) {
      setError(err.message || "Error inesperado al iniciar sesión");
    }
  };

  const handleLogout = () => {
    logout(); // Llama al estado global de logout
    navigate("/login"); // Redirige al login
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show
        when={typeof window !== "undefined" && user()}
        fallback={
          <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
            <h1 class="text-2xl font-bold mb-4">Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
              {error() && <p class="text-red-500 mb-2">{error()}</p>}
              <div class="mb-4">
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              <div class="mb-4">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        }
      >
        <div class="bg-blue-100 p-6 rounded-md shadow-md">
          <h1 class="text-2xl font-bold mb-4">
            ¡Bienvenido, {user()?.email}!
          </h1>
          <button
            class="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </Show>
    </main>
  );
}
