import { A } from "@solidjs/router";
import AuthGuard from "~/components/login/AuthGuard"; // Importa el AuthGuard
import MapComponent from "~/components/Map";

export default function Rutas() {
  return (
    <AuthGuard>
      <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Rutas</h1>
        <MapComponent />
      </main>
    </AuthGuard>
  );
}
