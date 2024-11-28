import { createSignal, createEffect, onMount } from "solid-js";
import { deleteCliente, getClientes, postCliente, putCliente } from "../api";

export default function Clientes() {
  const [clients, setClients] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
  const [errors, setErrors] = createSignal({});

  const limit = 50;

  const [newClient, setNewClient] = createSignal({
    Cliente: "",
    Nombre_1: "",
    Nombre_2: "",
    Telefono_1: "",
    Poblacion: "",
    Calle: "",
    GClt: "",
  });

  const [editingClient, setEditingClient] = createSignal({
    Cliente: "",
    Nombre_1: "",
    Nombre_2: "",
    Telefono_1: "",
    Poblacion: "",
    Calle: "",
    GClt: "",
  });

  const [deleteClientId, setDeleteClientId] = createSignal("");

  const [isCreateModalOpen, setCreateModalOpen] = createSignal(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = createSignal(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = createSignal(false);

  const fetchClients = async (isLoadMore = false) => {
    setIsLoading(true);

    try {
      // const url = new URL("http://localhost:7000/api/clients");
      // url.searchParams.append("limit", limit);
      // url.searchParams.append("offset", isLoadMore ? offset() : 0);
      // if (searchQuery()) {
      //   url.searchParams.append("search", searchQuery());
      // }

      // const response = await fetch(url.toString());
      const response = await getClientes(limit, isLoadMore ? offset() : 0, searchQuery());

      if (isLoadMore) {
        setClients([...clients(), ...data]);
      } else {
        setClients(response);
        setOffset(0);
      }

      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async () => {
    try {
      // const response = await fetch("http://localhost:7001/api/clients", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newClient()),
      // });

      const response = await postCliente(newClient());

      if (response.ok) {
        alert("Cliente creado exitosamente.");
        fetchClients();
        setCreateModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const updateClient = async () => {
    const clientData = Object.fromEntries(
      Object.entries(editingClient()).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value, // Aplica trim aquí
      ])
    );
  
    if (!clientData.Cliente) {
      alert("El ID del cliente es obligatorio.");
      return;
    }
  
    try {
      // const response = await fetch(
      //   `http://localhost:7002/api/clients/${clientData.Cliente}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(clientData),
      //   }
      // );

      const response = await putCliente(clientData);
  
      if (response.ok) {
        alert("Cliente actualizado exitosamente.");
        fetchClients();
        setUpdateModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };
  

  const deleteClient = async () => {
    if (!deleteClientId()) return alert("ID del cliente es requerido.");
    try {
      // const response = await fetch(
      //   `http://localhost:7003/api/clients/${deleteClientId()}`,
      //   { method: "DELETE" }
      // );

      const response = await deleteCliente(deleteClientId());

      if (response.ok) {
        alert("Cliente eliminado exitosamente.");
        fetchClients();
        setDeleteModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const loadMoreClients = () => {
    if (hasMore()) {
      setOffset(offset() + limit);
      fetchClients(true);
    }
  };

  createEffect(() => {
    fetchClients();
  });

  onMount(() => {
    fetchClients();
  });

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Clientes</h1>

      {/* Botones para CRUD */}
      <div class="mt-4 flex justify-end mb-6 space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setCreateModalOpen(true)}
        >
          Crear Cliente
        </button>
        <button
          class="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setUpdateModalOpen(true)}
        >
          Actualizar Cliente
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setDeleteModalOpen(true)}
        >
          Eliminar Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div class="mb-6">
        <input
          type="text"
          placeholder="Buscar por ID, nombre, teléfono o población..."
          class="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabla de clientes */}
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">ID</th>
              <th class="border border-gray-300 px-4 py-2">Nombre 1</th>
              <th class="border border-gray-300 px-4 py-2">Nombre 2</th>
              <th class="border border-gray-300 px-4 py-2">Teléfono</th>
              <th class="border border-gray-300 px-4 py-2">Población</th>
              <th class="border border-gray-300 px-4 py-2">Calle</th>
            </tr>
          </thead>
          <tbody>
            {clients().map((client) => (
              <tr key={client.Cliente} class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{client.Cliente}</td>
                <td class="border border-gray-300 px-4 py-2">{client.Nombre_1}</td>
                <td class="border border-gray-300 px-4 py-2">{client.Nombre_2 || "N/A"}</td>
                <td class="border border-gray-300 px-4 py-2">{client.Telefono_1|| "N/A"}</td>
                <td class="border border-gray-300 px-4 py-2">{client.Poblacion|| "N/A"}</td>
                <td class="border border-gray-300 px-4 py-2">{client.Calle || "N/A"}</td>
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
            onClick={loadMoreClients}
            disabled={isLoading()}
          >
            {isLoading() ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

       {/* Modal Crear */}
{isCreateModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-2xl mb-4">Crear Cliente</h2>
      <input
        type="text"
        placeholder="ID Cliente"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Cliente ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Cliente}
        onInput={(e) => setNewClient({ ...newClient(), Cliente: e.target.value })}
      />
      <input
        type="text"
        placeholder="Nombre 1"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Nombre_1 ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Nombre_1}
        onInput={(e) => setNewClient({ ...newClient(), Nombre_1: e.target.value })}
      />
      <input
        type="text"
        placeholder="Nombre 2"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Nombre_2 ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Nombre_2}
        onInput={(e) => setNewClient({ ...newClient(), Nombre_2: e.target.value })}
      />
      <input
        type="text"
        placeholder="Calle"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Calle ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Calle}
        onInput={(e) => setNewClient({ ...newClient(), Calle: e.target.value })}
      />
      <input
        type="text"
        placeholder="Teléfono"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Telefono_1 ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Telefono_1}
        onInput={(e) => setNewClient({ ...newClient(), Telefono_1: e.target.value })}
      />
      <input
        type="text"
        placeholder="Población"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !newClient().Poblacion ? "border-red-500" : "border-gray-300"
        }`}
        value={newClient().Poblacion}
        onInput={(e) => setNewClient({ ...newClient(), Poblacion: e.target.value })}
      />
      <div class="flex justify-end gap-4">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setCreateModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (
              !newClient().Cliente ||
              !newClient().Nombre_1 ||
              !newClient().Nombre_2 ||
              !newClient().Calle ||
              !newClient().Telefono_1 ||
              !newClient().Poblacion
            ) {
              alert("Todos los campos son obligatorios.");
              return;
            }
            createClient();
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal Actualizar */}
{isUpdateModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-2xl mb-4">Actualizar Cliente</h2>
      <input
        type="text"
        placeholder="ID Cliente"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Cliente || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Cliente: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Nombre 1"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Nombre_1 || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Nombre_1: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Nombre 2"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Nombre_2 || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Nombre_2: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Teléfono"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Telefono_1 || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Telefono_1: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Población"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Poblacion || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Poblacion: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Calle"
        class="mb-2 w-full px-4 py-2 border rounded"
        value={editingClient().Calle || ""}
        onInput={(e) =>
          setEditingClient({ ...editingClient(), Calle: e.target.value })
        }
      />
      <div class="flex justify-end gap-4">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setUpdateModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => {
            const filteredClient = Object.fromEntries(
              Object.entries(editingClient()).filter(
                ([key, value]) => key === "Cliente" || (value && value.trim() !== "")
              )
            );

            if (!filteredClient.Cliente) {
              alert("El ID del cliente es obligatorio.");
              return;
            }

            updateClient(filteredClient); // Enviar solo los campos que tienen valor
          }}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal Eliminar */}
{isDeleteModalOpen() && (
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-2xl mb-4">Eliminar Cliente</h2>
      <input
        type="text"
        placeholder="ID Cliente"
        class={`mb-2 w-full px-4 py-2 border rounded ${
          !deleteClientId() ? "border-red-500" : "border-gray-300"
        }`}
        value={deleteClientId()}
        onInput={(e) => setDeleteClientId(e.target.value)}
      />
      <div class="flex justify-end gap-4">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setDeleteModalOpen(false)}
        >
          Cancelar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (!deleteClientId()) {
              alert("El ID del cliente es obligatorio.");
              return;
            }
            deleteClient(); // Ejecuta la función de eliminación
          }}
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
