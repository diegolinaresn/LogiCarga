import { createSignal, createEffect } from "solid-js";

export default function UserProfile() {
  const [user, setUser] = createSignal(null);

  createEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:5005/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(setUser)
        .catch(() => {
          setUser(null);
        });
    }
  });

  return (
   
        <button
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onclick={() => {
            window.location.href = "/editprofile";
          }}
        >
          Editar Perfil
        </button>
    

  );
}
