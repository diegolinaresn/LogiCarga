import { createSignal, createEffect, onMount } from "solid-js";

export default function Cargues() {
  const [cargues, setCargues] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
  const [errors, setErrors] = createSignal({});

  const limit = 15;

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

  const validateFields = (fields) => {
    const missingFields = Object.entries(fields).filter(([key, value]) => !value.trim());
    if (missingFields.length > 0) {
      alert(`Por favor, completa los campos: ${missingFields.map(([key]) => key).join(", ")}`);
      return false;
    }
    return true;
  };

  const createCargue = async () => {
    if (!validateFields(newCargue())) return;

    try {
      const response = await fetch("http://localhost:6001/cargues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargues: [newCargue()] }),
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
    if (!validateFields(editingCargue())) return;

    try {
      const response = await fetch("http://localhost:6005/cargues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargues: [editingCargue()] }),
      });

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
    if (!deleteCargueId()) {
      alert("Debe proporcionar un código de cargue para eliminar.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6008/cargues", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CODIGO_CARGUE: [deleteCargueId()] }),
      });

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
          placeholder="Buscar por ID o nombre de cargue..."
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

      {/* Modales */}
      {isCreateModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-2xl font-bold mb-4">Crear Cargue</h2>
            <form>
              <input
                type="text"
                placeholder="ID"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().CODIGO_CARGUE}
                onInput={(e) =>
                  setNewCargue({ ...newCargue(), CODIGO_CARGUE: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Nombre de Carga"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().CARGUE}
                onInput={(e) =>
                  setNewCargue({ ...newCargue(), CARGUE: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Fecha de Salida"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().FECHASALIDACARGUE}
                onInput={(e) =>
                  setNewCargue({
                    ...newCargue(),
                    FECHASALIDACARGUE: e.target.value, // El valor será YYYY-MM-DD
                  })
                }
              />
              <input
                type="time"
                placeholder="Hora de Salida"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().HORA_SALIDA_CARGUE}
                onInput={(e) =>
                  setNewCargue({
                    ...newCargue(),
                    HORA_SALIDA_CARGUE: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Horas de Espera"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().HORAS_ESPERA_CARGUE}
                onInput={(e) =>
                  setNewCargue({
                    ...newCargue(),
                    HORAS_ESPERA_CARGUE: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Horas de Carga"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={newCargue().HORAS_CARGUE}
                onInput={(e) =>
                  setNewCargue({
                    ...newCargue(),
                    HORAS_CARGUE: e.target.value,
                  })
                }
              />
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={createCargue}
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-2xl font-bold mb-4">Actualizar Cargue</h2>
            <form>
              <input
                type="text"
                placeholder="ID"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().CODIGO_CARGUE}
                onInput={(e) =>
                  setEditingCargue({
                    ...editingCargue(),
                    CODIGO_CARGUE: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Nombre de Carga"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().CARGUE}
                onInput={(e) =>
                  setEditingCargue({ ...editingCargue(), CARGUE: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Fecha de Salida"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().FECHASALIDACARGUE}
                onInput={(e) =>
                  setEditingCargue({
                    ...editingCargue(),
                    FECHASALIDACARGUE: e.target.value,
                  })
                }
              />
              <input
                type="time"
                placeholder="Hora de Salida"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().HORA_SALIDA_CARGUE}
                onInput={(e) =>
                  setEditingCargue({
                    ...editingCargue(),
                    HORA_SALIDA_CARGUE: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Horas de Espera"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().HORAS_ESPERA_CARGUE}
                onInput={(e) =>
                  setEditingCargue({
                    ...editingCargue(),
                    HORAS_ESPERA_CARGUE: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Horas de Carga"
                class="w-full px-4 py-2 mb-3 border rounded"
                value={editingCargue().HORAS_CARGUE}
                onInput={(e) =>
                  setEditingCargue({
                    ...editingCargue(),
                    HORAS_CARGUE: e.target.value,
                  })
                }
              />
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setUpdateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={updateCargue}
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-2xl font-bold mb-4">Eliminar Cargue</h2>
            <p class="mb-3">Introduce el ID del cargue que deseas eliminar:</p>
            <input
              type="text"
              placeholder="ID"
              class="w-full px-4 py-2 mb-3 border rounded"
              value={deleteCargueId()}
              onInput={(e) => setDeleteCargueId(e.target.value)}
            />
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                class="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteCargue}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
