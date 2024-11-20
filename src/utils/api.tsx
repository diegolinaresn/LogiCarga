const API_BASE_URL = "http://127.0.0.1:5005";

export const api = {
  // Método para iniciar sesión
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error desconocido");
    }
    return response.json(); // Devuelve el token JWT
  },

  // Método para obtener datos de usuario autenticado
  getUserData: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error desconocido");
    }
    return response.json(); // Devuelve los datos del usuario
  },
};
