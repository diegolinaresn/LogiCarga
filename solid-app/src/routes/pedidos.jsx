import { createSignal, createEffect, onMount } from "solid-js";

export default function Pedidos() {
  // Señales para Vehículos
  const [vehiculos, setVehiculos] = createSignal([]);
  const [newVehiculo, setNewVehiculo] = createSignal({
    PLACA: "",
    CONFIGURACION: "",
    GPS: "",
    CONDUCTOR: "",
    EMPRESA: "",
  });
  const [editingVehiculo, setEditingVehiculo] = createSignal(null);
  const [vehiculoToDelete, setVehiculoToDelete] = createSignal(null);

  // Señales para Cargues
  const [cargues, setCargues] = createSignal([]);
  const [newCargue, setNewCargue] = createSignal({
    CODIGO_CARGUE: "",
    CARGUE: "",
    FECHASALIDACARGUE: "",
    HORA_SALIDA_CARGUE: "",
    HORAS_ESPERA_CARGUE: "",
    HORAS_CARGUE: "",
  });
  const [editingCargue, setEditingCargue] = createSignal(null);
  const [cargueToDelete, setCargueToDelete] = createSignal(null);

  // Modales
  const [isAddVehiculoModalOpen, setAddVehiculoModalOpen] = createSignal(false);
  const [isEditVehiculoModalOpen, setEditVehiculoModalOpen] = createSignal(false);
  const [isDeleteVehiculoModalOpen, setDeleteVehiculoModalOpen] = createSignal(false);

  const [isAddCargueModalOpen, setAddCargueModalOpen] = createSignal(false);
  const [isEditCargueModalOpen, setEditCargueModalOpen] = createSignal(false);
  const [isDeleteCargueModalOpen, setDeleteCargueModalOpen] = createSignal(false);

  // Paginación
  const [currentPageVehiculos, setCurrentPageVehiculos] = createSignal(1);
  const [currentPageCargues, setCurrentPageCargues] = createSignal(1);
  const itemsPerPage = 10;

  // Fetch data
  const fetchVehiculos = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/vehiculos");
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      console.error("Error fetching vehiculos:", error);
    }
  };

  const fetchCargues = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/cargues");
      const data = await response.json();
      setCargues(data);
    } catch (error) {
      console.error("Error fetching cargues:", error);
    }
  };

  // CRUD Operations for Vehiculos
  const addVehiculo = async () => {
    try {
      const response = await fetch("http://localhost:7001/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehiculo()),
      });

      if (response.ok) {
        alert("Vehículo creado exitosamente.");
        fetchVehiculos();
        setAddVehiculoModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating vehiculo:", error);
    }
  };

  const updateVehiculo = async () => {
    try {
      const response = await fetch(
        `http://localhost:7002/api/vehiculos/${editingVehiculo().PLACA}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingVehiculo()),
        }
      );

      if (response.ok) {
        alert("Vehículo actualizado exitosamente.");
        fetchVehiculos();
        setEditVehiculoModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating vehiculo:", error);
    }
  };

  const deleteVehiculo = async () => {
    try {
      const response = await fetch(
        `http://localhost:7003/api/vehiculos/${vehiculoToDelete().PLACA}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Vehículo eliminado exitosamente.");
        fetchVehiculos();
        setDeleteVehiculoModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting vehiculo:", error);
    }
  };

  // CRUD Operations for Cargues
  const addCargue = async () => {
    try {
      const response = await fetch("http://localhost:7001/api/cargues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCargue()),
      });

      if (response.ok) {
        alert("Carga creado exitosamente.");
        fetchCargues();
        setAddCargueModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating Carga:", error);
    }
  };

  const updateCargue = async () => {
    try {
      const response = await fetch(
        `http://localhost:7002/api/cargues/${editingCargue().CODIGO_CARGUE}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCargue()),
        }
      );

      if (response.ok) {
        alert("Carga actualizado exitosamente.");
        fetchCargues();
        setEditCargueModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating carga:", error);
    }
  };

  const deleteCargue = async () => {
    try {
      const response = await fetch(
        `http://localhost:7003/api/cargues/${cargueToDelete().CODIGO_CARGUE}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Carga eliminado exitosamente.");
        fetchCargues();
        setDeleteCargueModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting carga:", error);
    }
  };

  createEffect(() => {
    fetchVehiculos();
    fetchCargues();
  });

  onMount(() => {
    fetchVehiculos();
    fetchCargues();
  });

  const totalPagesVehiculos = Math.ceil(vehiculos().length / itemsPerPage);
  const totalPagesCargues = Math.ceil(cargues().length / itemsPerPage);

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Gestión de Vehículos y Cargues</h1>

      {/* Vehículos Section */}
      <section class="mb-8">
        <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Vehículos</h2>
        <div class="flex justify-end gap-4 mb-4">
          <button
            class="bg-sky-500 text-white px-4 py-2 rounded"
            onClick={() => setAddVehiculoModalOpen(true)}
          >
            Agregar Vehículo
          </button>
          <button
            class="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setEditVehiculoModalOpen(true)}
          >
            Actualizar Vehículo
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setDeleteVehiculoModalOpen(true)}
          >
            Eliminar Vehículo
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-200">
                <th class="border border-gray-300 px-4 py-2">PLACA</th>
                <th class="border border-gray-300 px-4 py-2">CONFIGURACION</th>
                <th class="border border-gray-300 px-4 py-2">GPS</th>
                <th class="border border-gray-300 px-4 py-2">CONDUCTOR</th>
                <th class="border border-gray-300 px-4 py-2">EMPRESA</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos()
                .slice((currentPageVehiculos() - 1) * itemsPerPage, currentPageVehiculos() * itemsPerPage)
                .map((vehiculo) => (
                  <tr key={vehiculo.PLACA} class="hover:bg-gray-100">
                    <td class="border border-gray-300 px-4 py-2">{vehiculo.PLACA}</td>
                    <td class="border border-gray-300 px-4 py-2">{vehiculo.CONFIGURACION}</td>
                    <td class="border border-gray-300 px-4 py-2">{vehiculo.GPS}</td>
                    <td class="border border-gray-300 px-4 py-2">{vehiculo.CONDUCTOR}</td>
                    <td class="border border-gray-300 px-4 py-2">{vehiculo.EMPRESA}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div class="flex justify-center mt-4">
          {[...Array(totalPagesVehiculos)].map((_, index) => (
            <button
              class={`mx-1 px-3 py-1 rounded ${currentPageVehiculos() === index + 1 ? "bg-sky-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPageVehiculos(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>

      {/* Cargues Section */}
      <section>
        <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Cargues</h2>
        <div class="flex justify-end gap-4 mb-4">
          <button
            class="bg-sky-500 text-white px-4 py-2 rounded"
            onClick={() => setAddCargueModalOpen(true)}
          >
            Agregar Carga
          </button>
          <button
            class="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setEditCargueModalOpen(true)}
          >
            Actualizar Carga
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setDeleteCargueModalOpen(true)}
          >
            Eliminar Carga
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-200">
                <th class="border border-gray-300 px-4 py-2">ID</th>
                <th class="border border-gray-300 px-4 py-2">NOMBRE DE CARGA</th>
                <th class="border border-gray-300 px-4 py-2">FECHA SALIDA </th>
                <th class="border border-gray-300 px-4 py-2">HORA SALIDA</th>
                <th class="border border-gray-300 px-4 py-2">HORAS ESPERA</th>
                <th class="border border-gray-300 px-4 py-2">HORAS CARGA</th>
              </tr>
            </thead>
            <tbody>
              {cargues()
                .slice((currentPageCargues() - 1) * itemsPerPage, currentPageCargues() * itemsPerPage)
                .map((cargue) => (
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
        <div class="flex justify-center mt-4">
          {[...Array(totalPagesCargues)].map((_, index) => (
            <button
              class={`mx-1 px-3 py-1 rounded ${currentPageCargues() === index + 1 ? "bg-sky-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPageCargues(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}