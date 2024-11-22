import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function Vehiculos() {
  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">About Page</h1>
      <Counter />
      <p class="mt-8">
        Visit{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Home
        </A>
        {" - "}
        <span>MIAMER</span>
      </p>
    </main>
  );
}
