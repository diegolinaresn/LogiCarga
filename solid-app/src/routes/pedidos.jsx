import { createSignal, createEffect, onMount } from "solid-js";

export default function Cargues() {
  const [cargues, setCargues] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
  const [errors, setErrors] = createSignal({});

  const limit = 15; // Establecido por el backend

  const [newCargue, setNewCargue] = createSignal({
    CODIGO_CARGUE: "",
    CARGUE: "",
    FECHASALIDACARGUE: "",
    HORA_SALIDA_CARGUE: "",
    HORAS_ESPERA_CARGUE: "",
    HORAS_CARGUE: "",
  });

  const [editingCargue, setEditingCargue] = createSignal({
    CODIGO_CARGUE: "",
    CARGUE: "",
    FECHASALIDACARGUE: "",
    HORA_SALIDA_CARGUE: "",
    HORAS_ESPERA_CARGUE: "",
    HORAS_CARGUE: "",
  });

  const [deleteCargueId, setDeleteCargueId] = createSignal("");

  const [isCreateModalOpen, setCreateModalOpen] = createSignal(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = createSignal(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = createSignal(false);

  const fetchCargues = async (isLoadMore = false) => {
    setIsLoading(true);

    try {
      const url = new URL("http://localhost:6010/cargues");
      url.searchParams.append("limit", limit);
      url.searchParams.append("offset", isLoadMore ? offset() : 0);
      if (searchQuery()) {
        url.searchParams.append("search", searchQuery());
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (isLoadMore) {
        setCargues([...cargues(), ...data]);
      } else {
        setCargues(data);
        setOffset(0);
      }

      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error fetching cargues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCargue = async () => {
    try {
      const response = await fetch("http://localhost:6011/cargues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCargue()),
      });

      if (response.ok) {
        alert("Cargue creado exitosamente.");
        fetchCargues();
        setCreateModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating cargue:", error);
    }
  };

  const updateCargue = async () => {
    if (!editingCargue().CODIGO_CARGUE) {
      alert("El código del cargue es obligatorio.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:6012/cargues/${editingCargue().CODIGO_CARGUE}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCargue()),
        }
      );

      if (response.ok) {
        alert("Cargue actualizado exitosamente.");
        fetchCargues();
        setUpdateModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating cargue:", error);
    }
  };

  const deleteCargue = async () => {
    if (!deleteCargueId()) return alert("El ID del cargue es requerido.");

    try {
      const response = await fetch(
        `http://localhost:6013/cargues/${deleteCargueId()}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Cargue eliminado exitosamente.");
        fetchCargues();
        setDeleteModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting cargue:", error);
    }
  };

  const loadMoreCargues = () => {
    if (hasMore()) {
      setOffset(offset() + limit);
      fetchCargues(true);
    }
  };

  createEffect(() => {
    fetchCargues();
  });

  onMount(() => {
    fetchCargues();
  });

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Cargues</h1>

      {/* Botones para CRUD */}
      <div class="mt-4 flex justify-end mb-6 space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setCreateModalOpen(true)}
        >
          Crear Cargue
        </button>
        <button
          class="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setUpdateModalOpen(true)}
        >
          Actualizar Cargue
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setDeleteModalOpen(true)}
        >
          Eliminar Cargue
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div class="mb-6">
        <input
          type="text"
          placeholder="Buscar por código o nombre de cargue..."
          class="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabla de cargues */}
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">ID</th>
              <th class="border border-gray-300 px-4 py-2">Nombre de Carga</th>
              <th class="border border-gray-300 px-4 py-2">Fecha Salida</th>
              <th class="border border-gray-300 px-4 py-2">Hora Salida</th>
              <th class="border border-gray-300 px-4 py-2">Horas Espera</th>
              <th class="border border-gray-300 px-4 py-2">Horas Carga</th>
            </tr>
          </thead>
          <tbody>
            {cargues().map((cargue) => (
              <tr key={cargue.CODIGO_CARGUE} class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{cargue.CODIGO_CARGUE}</td>
                <td class="border border-gray-300 px-4 py-2">{cargue.CARGUE}</td>
                <td class="border border-gray-300 px-4 py-2">{cargue.FECHASALIDACARGUE}</td>
                <td class="border border-gray-300 px-4 py-2">{cargue.HORA_SALIDA_CARGUE}</td>
                <td class="border border-gray-300 px-4 py-2">{cargue.HORAS_ESPERA_CARGUE}</td>
                <td class="border border-gray-300 px-4 py-2">{cargue.HORAS_CARGUE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para cargar más */}
      {hasMore() && (
        <div class="flex justify-center mt-4">
          <button
            class="bg-sky-500 text-white px-4 py-2 rounded"
            onClick={loadMoreCargues}
            disabled={isLoading()}
          >
            {isLoading() ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </main>
  );
}
