import { createSignal } from "solid-js";

export default function Pedidos() {
  const [orders, setOrders] = createSignal([
    { id: 1, customer: "Juan Perez", product: "Laptop", status: "En Proceso" },
    { id: 2, customer: "Maria Lopez", product: "Smartphone", status: "Entregado" },
  ]);

  const [isAddModalOpen, setAddModalOpen] = createSignal(false);
  const [isEditModalOpen, setEditModalOpen] = createSignal(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [newOrder, setNewOrder] = createSignal({
    customer: "",
    product: "",
    status: "En Proceso",
  });
  const [editingOrder, setEditingOrder] = createSignal(null);
  const [orderToDelete, setOrderToDelete] = createSignal(null);

  const addOrder = () => {
    if (newOrder().customer && newOrder().product) {
      setOrders([
        ...orders(),
        { id: orders().length + 1, ...newOrder() },
      ]);
      setNewOrder({ customer: "", product: "", status: "En Proceso" });
      setAddModalOpen(false);
    }
  };

  const updateOrder = () => {
    if (editingOrder().customer && editingOrder().product) {
      setOrders(
        orders().map((order) =>
          order.id === editingOrder().id ? editingOrder() : order
        )
      );
      setEditingOrder(null);
      setEditModalOpen(false);
    }
  };

  const deleteOrder = () => {
    setOrders(orders().filter((order) => order.id !== orderToDelete().id));
    setDeleteModalOpen(false);
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Pedidos</h1>

      {/* Buttons Row */}
      <div class="flex justify-end gap-4 mb-4">
        <button
          class="bg-sky-500 text-white px-4 py-2 rounded"
          onClick={() => setAddModalOpen(true)}
        >
          Agregar
        </button>
        
        <button
          class="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            const firstOrder = orders()[0];
            if (firstOrder) {
              setOrderToDelete(firstOrder);
              setDeleteModalOpen(true);
            }
          }}
        >
          Eliminar
        </button>
      </div>

      {/* Orders Table */}
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">ID</th>
              <th class="border border-gray-300 px-4 py-2">Cliente</th>
              <th class="border border-gray-300 px-4 py-2">Producto</th>
              <th class="border border-gray-300 px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders().map((order) => (
              <tr key={order.id} class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{order.id}</td>
                <td class="border border-gray-300 px-4 py-2">{order.customer}</td>
                <td class="border border-gray-300 px-4 py-2">{order.product}</td>
                <td class="border border-gray-300 px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Order Modal */}
      {isAddModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-md w-96">
            <h2 class="text-2xl mb-4">Agregar Pedido</h2>
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="text"
              placeholder="Cliente"
              value={newOrder().customer}
              onInput={(e) =>
                setNewOrder({ ...newOrder(), customer: e.target.value })
              }
            />
            <input
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              type="text"
              placeholder="Producto"
              value={newOrder().product}
              onInput={(e) =>
                setNewOrder({ ...newOrder(), product: e.target.value })
              }
            />
            <select
              class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              value={newOrder().status}
              onChange={(e) =>
                setNewOrder({ ...newOrder(), status: e.target.value })
              }
            >
              <option value="En Proceso">En Proceso</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <div class="flex justify-end gap-4">
              <button
                class="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setAddModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                class="bg-sky-500 text-white px-4 py-2 rounded"
                onClick={addOrder}
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
            <h2 class="text-xl mb-4">¿Eliminar Pedido?</h2>
            <p class="mb-4">
              ¿Estás seguro de que deseas eliminar el pedido de{" "}
              {orderToDelete()?.customer}?
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
                onClick={deleteOrder}
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
