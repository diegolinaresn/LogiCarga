import { createSignal } from "solid-js";

export default function Clientes() {
  const [clients, setClients] = createSignal([
    { id: 1, name: "Juan Perez", email: "juanperez@example.com", phone: "555-1234" },
    { id: 2, name: "Maria Lopez", email: "marialopez@example.com", phone: "555-5678" },
  ]);

  const [isAddModalOpen, setAddModalOpen] = createSignal(false);
  const [isEditModalOpen, setEditModalOpen] = createSignal(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [newClient, setNewClient] = createSignal({ name: "", email: "", phone: "" });
  const [editingClient, setEditingClient] = createSignal(null);
  const [deleteClientId, setDeleteClientId] = createSignal("");
  const [editClientId, setEditClientId] = createSignal("");

  const addClient = () => {
    if (newClient().name && newClient().email && newClient().phone) {
      setClients([
        ...clients(),
        { id: clients().length + 1, ...newClient() },
      ]);
      setNewClient({ name: "", email: "", phone: "" });
      setAddModalOpen(false);
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  const updateClient = () => {
    if (editingClient().name && editingClient().email && editingClient().phone) {
      setClients(
        clients().map((client) =>
          client.id === editingClient().id ? editingClient() : client
        )
      );
      setEditingClient(null);
      setEditModalOpen(false);
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  const deleteClient = () => {
    const clientId = parseInt(deleteClientId());
    const clientExists = clients().find((client) => client.id === clientId);
    if (clientExists) {
      setClients(clients().filter((client) => client.id !== clientId));
      setDeleteClientId("");
      setDeleteModalOpen(false);
    } else {
      alert("Cliente no encontrado.");
    }
  };

  const searchClientForEdit = () => {
    const clientId = parseInt(editClientId());
    const clientToEdit = clients().find((client) => client.id === clientId);
    if (clientToEdit) {
      setEditingClient(clientToEdit);
    } else {
      alert("Cliente no encontrado.");
    }
  };

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Clientes</h1>

      <div class="flex justify-end gap-4 mb-4">
        <button
          class="bg-sky-500 text-white px-4 py-2 rounded"
          onClick={() => setAddModalOpen(true)}
        >
          Agregar
        </button>
        <button
          class="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setEditModalOpen(true)}
        >
          Editar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setDeleteModalOpen(true)}
        >
          Eliminar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">ID</th>
              <th class="border border-gray-300 px-4 py-2">Nombre</th>
              <th class="border border-gray-300 px-4 py-2">Email</th>
              <th class="border border-gray-300 px-4 py-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clients().map((client) => (
              <tr key={client.id} class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{client.id}</td>
                <td class="border border-gray-300 px-4 py-2">{client.name}</td>
                <td class="border border-gray-300 px-4 py-2">{client.email}</td>
                <td class="border border-gray-300 px-4 py-2">{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-md w-96">
            <h2 class="text-2xl mb-4">Agregar Cliente</h2>
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="text"
              placeholder="Nombre"
              value={newClient().name}
              onInput={(e) => setNewClient({ ...newClient(), name: e.target.value })}
            />
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="email"
              placeholder="Email"
              value={newClient().email}
              onInput={(e) => setNewClient({ ...newClient(), email: e.target.value })}
            />
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="tel"
              placeholder="Teléfono"
              value={newClient().phone}
              onInput={(e) => setNewClient({ ...newClient(), phone: e.target.value })}
            />
            <div class="flex justify-end gap-4">
              <button
                class="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setAddModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                class="bg-green-500 text-white px-4 py-2 rounded"
                onClick={addClient}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-md w-96">
            <h2 class="text-2xl mb-4">Editar Cliente</h2>
            {/* Input to search for the client by ID */}
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="number"
              placeholder="ID del cliente"
              value={editClientId()}
              onInput={(e) => setEditClientId(e.target.value)}
            />
            <button
              class="bg-yellow-500 text-white px-4 py-2 rounded w-full mb-4"
              onClick={searchClientForEdit}
            >
              Buscar Cliente
            </button>

            {/* Display client details if found */}
            {editingClient() && (
              <>
                <input
                  class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                  type="text"
                  placeholder="Nombre"
                  value={editingClient()?.name || ""}
                  onInput={(e) =>
                    setEditingClient({ ...editingClient(), name: e.target.value })
                  }
                />
                <input
                  class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                  type="email"
                  placeholder="Email"
                  value={editingClient()?.email || ""}
                  onInput={(e) =>
                    setEditingClient({ ...editingClient(), email: e.target.value })
                  }
                />
                <input
                  class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                  type="tel"
                  placeholder="Teléfono"
                  value={editingClient()?.phone || ""}
                  onInput={(e) =>
                    setEditingClient({ ...editingClient(), phone: e.target.value })
                  }
                />
                <div class="flex justify-end gap-4">
                  <button
                    class="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    class="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={updateClient}
                  >
                    Guardar cambios
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Client Modal */}
      {isDeleteModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-md w-96">
            <h2 class="text-2xl mb-4">Eliminar Cliente</h2>
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="number"
              placeholder="ID del cliente"
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
                onClick={deleteClient}
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
