import { A } from "@solidjs/router";
import AuthGuard from "~/components/login/AuthGuard"; // Importa el AuthGuard
import MapComponent from "~/components/Map";

export default function Rutas() {
  return (
    <AuthGuard>
      <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Rutas</h1>
        <MapComponent />
      </main>
    </AuthGuard>
  );
}
