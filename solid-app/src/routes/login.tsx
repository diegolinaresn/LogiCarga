import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { login, logout } from "../components/authstore";

// Función para obtener los datos del usuario
const fetchUserData = async (token: string) => {
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
  const [isLoading, setIsLoading] = createSignal(false); // Estado para manejar el loading
  const navigate = useNavigate();

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);

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
    } finally {
      setIsLoading(false); // Detener el loading
    }
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 class="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        {error() && <p class="text-red-500 mb-2">{error()}</p>}
        <form onSubmit={handleLogin}>
          <div class="mb-4">
            <label class="block text-left text-gray-700 font-semibold">Correo Electrónico:</label>
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
            <label class="block text-left text-gray-700 font-semibold">Contraseña:</label>
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
            disabled={isLoading()}
          >
            {isLoading() ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
  