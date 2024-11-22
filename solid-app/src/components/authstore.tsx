import { createSignal } from "solid-js";

// Estado global para el usuario y autenticación
const [user, setUser] = createSignal(null);
const [isLoggedIn, setIsLoggedIn] = createSignal(
  typeof window !== "undefined" && !!localStorage.getItem("token")
);

// Manejo del inicio de sesión
const login = (token: string, userData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsLoggedIn(true);
  }
};

// Manejo del cierre de sesión
const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  }
};

export { user, isLoggedIn, login, logout };
