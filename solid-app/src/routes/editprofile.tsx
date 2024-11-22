import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function EditProfile() {
  const [email, setEmail] = createSignal("");
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5005/users/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email(),
          name: name(),
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar los datos");

      alert("Perfil actualizado exitosamente");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token de autenticación
    navigate("/"); // Redirige al usuario a la página de login
  };

  return (

    <main class="text-center mx-auto text-gray-700 p-4">
      <div class="p-5 max-w-md mx-auto bg-white rounded shadow-md space-y-4">
        <h1 class="text-2xl font-bold">Editar Perfil</h1>
        {error() && <p class="text-red-500">{error()}</p>}
        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="mb-4">
            <label class="block mb-2 text-left font-semibold">
              Correo Electrónico:
            </label>
            <input
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-left font-semibold">Nombre:</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </main>
  );
}
