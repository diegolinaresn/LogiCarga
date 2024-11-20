import { createSignal } from "solid-js";

const [user, setUser] = createSignal(null); // Estado inicial consistente
const [isLoggedIn, setIsLoggedIn] = createSignal(
  typeof window !== "undefined" && !!localStorage.getItem("token")
);

const login = (token: string, userData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsLoggedIn(true);
  }
};

const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  }
};

export { user, isLoggedIn, login, logout };
