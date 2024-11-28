import { createSignal, createEffect, onMount } from "solid-js";
import { getCargas, deleteCarga, postCarga, putCarga } from "../utils/api.js";

export default function Cargas() {
  const [cargas, setCargas] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
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

  const fetchCargas = async (isLoadMore = false) => {
    setIsLoading(true);
    const params = {
      limit,
      offset: isLoadMore ? offset() : 0,
      search: searchQuery().trim(), // Asegúrate de enviar un valor sin espacios en blanco
    };
  
    try {
      const data = await getCargas(params);
      setCargas(isLoadMore ? [...cargas(), ...data] : data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error al obtener las cargas:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const validateCargueFields = (cargue) => {
    const requiredFields = [
      "CODIGO_CARGUE",
      "CARGUE",
      "FECHASALIDACARGUE",
      "HORA_SALIDA_CARGUE",
      "HORAS_ESPERA_CARGUE",
      "HORAS_CARGUE",
    ];

    const missingFields = requiredFields.filter(
      (field) => !cargue[field] || cargue[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert(`Los siguientes campos son obligatorios: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const createCargue = async () => {
    const cargueData = newCargue();
  
    // Validación de datos obligatorios
    if (!cargueData.CODIGO_CARGUE || !cargueData.CARGUE) {
      alert("El ID y el Nombre de la Carga son obligatorios.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Envuelve el objeto en un array
      const response = await postCarga([cargueData]);
  
      if (response.message) {
        alert(response.message);
      } else {
        alert("Cargue creado exitosamente.");
      }
  
      fetchCargas(); // Refresca la lista
      setCreateModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error creando cargue:", error);
      alert(`Error creando cargue: ${error.message || "Por favor, inténtalo nuevamente."}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  const updateCargue = async () => {
    const updatedCargueData = editingCargue();
    const codigoCargue = updatedCargueData.CODIGO_CARGUE;
  
    if (!codigoCargue) {
      alert("El código del cargue (CODIGO_CARGUE) es obligatorio.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Llama a la función putCarga
      const response = await putCarga(codigoCargue, updatedCargueData);
  
      if (response.message) {
        alert(response.message);
      } else {
        alert("Cargue actualizado exitosamente.");
      }
  
      fetchCargas(); // Actualiza la lista de cargues
      setUpdateModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error actualizando cargue:", error);
      alert(`Error al actualizar el cargue: ${error.message || "Error en el servidor."}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteCargue = async () => {
    const codigoCargue = deleteCargueId();

    if (!codigoCargue) {
      alert("Debe proporcionar un código de cargue para eliminar.");
      return;
    }

    try {
      setIsLoading(true);
      await deleteCarga(codigoCargue);

      alert("Cargue eliminado exitosamente.");
      fetchCargas();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error eliminando cargue:", error);
      alert(`Error al eliminar el cargue: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCargas = () => {
    if (hasMore()) {
      setOffset(offset() + limit);
      fetchCargas(true);
    }
  };

  createEffect(() => {
    fetchCargas();
  });

  onMount(() => {
    fetchCargas();
  });

// Actualizar los datos automáticamente cuando cambia la barra de búsqueda
createEffect(() => {
  const query = searchQuery().trim();
  if (query.length >= 2 || query.length === 0) {
    // Fetch solo si hay al menos 2 caracteres o si se limpia la búsqueda
    fetchCargas();
  }
});

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Cargas</h1>

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

      {/* Tabla de cargas */}
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
            {cargas().map((cargue) => (
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
            onClick={loadMoreCargas}
            disabled={isLoading()}
          >
            {isLoading() ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      {/* Modal Crear */}
      {isCreateModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl mb-4">Crear Cargue</h2>
      {/* Campo ID */}
      <input
        type="text"
        placeholder="ID"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().CODIGO_CARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), CODIGO_CARGUE: e.target.value })
        }
      />
      {/* Campo Nombre */}
      <input
        type="text"
        placeholder="Nombre de Carga"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().CARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), CARGUE: e.target.value })
        }
      />
      {/* Fecha de Salida */}
      <input
        type="date"
        placeholder="Fecha de Salida"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().FECHASALIDACARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), FECHASALIDACARGUE: e.target.value })
        }
      />
      {/* Hora de Salida */}
      <input
        type="time"
        placeholder="Hora de Salida"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().HORA_SALIDA_CARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), HORA_SALIDA_CARGUE: e.target.value })
        }
      />
      {/* Horas de Espera */}
      <input
        type="number"
        placeholder="Horas de Espera"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().HORAS_ESPERA_CARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), HORAS_ESPERA_CARGUE: e.target.value })
        }
      />
      {/* Horas de Carga */}
      <input
        type="number"
        placeholder="Horas de Carga"
        class="w-full px-4 py-2 mb-2 border rounded"
        value={newCargue().HORAS_CARGUE}
        onInput={(e) =>
          setNewCargue({ ...newCargue(), HORAS_CARGUE: e.target.value })
        }
      />
      {/* Botones */}
      <div class="flex justify-end space-x-4">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setCreateModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class={`bg-green-500 text-white px-4 py-2 rounded ${
            isLoading() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (
              !newCargue().CODIGO_CARGUE ||
              !newCargue().CARGUE ||
              !newCargue().FECHASALIDACARGUE ||
              !newCargue().HORA_SALIDA_CARGUE
            ) {
              alert("Todos los campos obligatorios deben estar completos.");
              return;
            }
            createCargue();
          }}
          disabled={isLoading()}
        >
          {isLoading() ? "Creando..." : "Crear"}
        </button>
      </div>
    </div>
  </div>
)}



     {/* Modal Actualizar */}
{isUpdateModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl mb-4">Actualizar Cargue</h2>
      <input
        type="text"
        placeholder="ID"
        class="w-full px-4 py-2 mb-2 border rounded"
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
        class="w-full px-4 py-2 mb-2 border rounded"
        value={editingCargue().CARGUE}
        onInput={(e) =>
          setEditingCargue({ ...editingCargue(), CARGUE: e.target.value })
        }
      />
      <input
        type="date"
        placeholder="Fecha de Salida"
        class="w-full px-4 py-2 mb-2 border rounded"
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
        class="w-full px-4 py-2 mb-2 border rounded"
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
        class="w-full px-4 py-2 mb-2 border rounded"
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
        class="w-full px-4 py-2 mb-2 border rounded"
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
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setUpdateModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class={`bg-yellow-500 text-white px-4 py-2 rounded ${
            isLoading() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={updateCargue}
          disabled={isLoading()}
        >
          {isLoading() ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal Eliminar */}
{isDeleteModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Eliminar Cargue</h2>
      <p class="mb-3">Introduce el ID del cargue que deseas eliminar:</p>
      <input
        type="text"
        placeholder="ID"
        class={`w-full px-4 py-2 mb-2 border rounded ${
          !deleteCargueId() ? "border-red-500" : "border-gray-300"
        }`}
        value={deleteCargueId()}
        onInput={(e) => setDeleteCargueId(e.target.value)}
      />
      <div class="flex justify-end space-x-4">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setDeleteModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class={`bg-red-500 text-white px-4 py-2 rounded ${
            isLoading() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={deleteCargue}
          disabled={isLoading()}
        >
          {isLoading() ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
