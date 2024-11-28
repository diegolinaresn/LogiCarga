import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { login, session } from "../utils/api.js"; // Importa las funciones desde tu archivo api.js
import { login as updateAuthStore } from "../components/authstore"; // Actualiza el estado global de autenticación

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Realiza la llamada de login usando la función importada
      const loginData = await login(email(), password());

      if (!loginData || !loginData.access_token) {
        throw new Error("Credenciales incorrectas o respuesta inválida del servidor.");
      }

      // Obtén los datos del usuario usando la función `session`
      const userData = await session(loginData.access_token);

      if (!userData) {
        throw new Error("Error al obtener los datos del usuario.");
      }

      // Actualiza el estado global de autenticación
      updateAuthStore(loginData.access_token, userData);

      // Redirige al usuario a la página principal
      navigate("/");
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
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
