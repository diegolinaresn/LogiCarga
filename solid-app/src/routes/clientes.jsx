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
  const [clientToDelete, setClientToDelete] = createSignal(null);

  const addClient = () => {
    if (newClient().name && newClient().email && newClient().phone) {
      setClients([
        ...clients(),
        { id: clients().length + 1, ...newClient() },
      ]);
      setNewClient({ name: "", email: "", phone: "" });
      setAddModalOpen(false);
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
    }
  };

  const deleteClient = () => {
    setClients(clients().filter((client) => client.id !== clientToDelete().id));
    setDeleteModalOpen(false);
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
  <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Clientes</h1>

      {/* Buttons Row */}
      <div class="flex justify-end gap-4 mb-4">
      <button
        class="bg-sky-500 text-white px-4 py-2 rounded"
        onClick={() => setAddModalOpen(true)}
      >
        Agregar
      </button>
      <button
        class="bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={() => {
          const firstClient = clients()[0];
          if (firstClient) {
            setEditingClient(firstClient);
            setEditModalOpen(true);
          }
        }}
      >
        Editar
      </button>
      <button
        class="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => {
          const firstClient = clients()[0];
          if (firstClient) {
            setClientToDelete(firstClient);
            setDeleteModalOpen(true);
          }
        }}
      >
        Eliminar
      </button>
    </div>


      {/* Clients Table */}
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
                class="bg-sky-500 text-white px-4 py-2 rounded"
                onClick={addClient}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-md w-96 text-center">
            <h2 class="text-xl mb-4">¿Eliminar Cliente?</h2>
            <p class="mb-4">
              ¿Estás seguro de que deseas eliminar a {clientToDelete()?.name}?
            </p>
            <div class="flex justify-center gap-4">
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
