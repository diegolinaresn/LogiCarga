import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function Register() {
  const [email, setEmail] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  const navigate = useNavigate();

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:5006/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email(),
          username: username(),
          password: password(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }

      setSuccess("Usuario registrado exitosamente. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000); // Redirigir al login después de 2 segundos
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        {error() && <p style={{ color: "red" }}>{error()}</p>}
        {success() && <p style={{ color: "green" }}>{success()}</p>}
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
    </main>
  );
}
