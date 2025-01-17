const IP = '34.57.17.229'; //Esta se cambia cada q se prende la instancia

// CARGAS /////////////////////////////////////////////////////////////////////////////////
const deleteCarga = async (codigoCargue) => {
    try {
        const response = await fetch(`http://${IP}:6008/api/cargas/${codigoCargue}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error eliminando el cargue.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al eliminar el cargue:", error);
        throw error;
    }
};




const getCargas = async ({ limit = 7, offset = 0, search = "" }) => {
    try {
        const url = new URL(`http://${IP}:6010/api/cargas`);
        url.searchParams.append("limit", limit);
        url.searchParams.append("offset", offset);
        if (search) {
            url.searchParams.append("search", search);
        }

        const response = await fetch(url.toString(), { method: "GET" });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al obtener las cargas.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getCargas:", error);
        throw error;
    }
};



const postCarga = async (cargues) => {
    try {
      const response = await fetch(`http://${IP}:6001/api/cargas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cargues }), // cargues debe ser un array
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear cargues.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error en postCarga:", error);
      throw error;
    }
  };
  

  const putCarga = async (codigoCargue, updatedCargueData) => {
    const url = `http://${IP}:6005/api/cargas`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", // Asegúrate de que sea exactamente así
            },
            body: JSON.stringify({
                cargues: [updatedCargueData], // Enviar la lista con un único elemento
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al actualizar el cargue");
        }

        return await response.json(); // Devuelve el mensaje o datos del servidor
    } catch (error) {
        console.error("Error en putCarga:", error);
        throw error;
    }
};



// CLIENTES /////////////////////////////////////////////////////////////////////////////////
const deleteCliente = async (idCliente) => {
    try {
        const response = await fetch(`http://${IP}:7003/api/clientes/${idCliente}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error eliminando el cliente.");
        }

        return { message: "Cliente eliminado exitosamente." };
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        throw error;
    }
};




const getClientes = async ({ limit = 20000, offset = 0, search = "" } = {}) => {
    try {
        const url = new URL(`http://${IP}:7000/api/clientes`);

        // Agregar los parámetros a la URL
        url.searchParams.append("limit", limit);
        url.searchParams.append("offset", offset);
        if (search) {
            url.searchParams.append("search", search);
        }

        // Realizar la solicitud GET
        const response = await fetch(url.toString(), {
            method: 'GET',
        });

        // Manejar la respuesta
        if (!response.ok) {
            throw new Error(`Error al obtener clientes: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna los datos obtenidos
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error; // Lanza el error para manejo posterior
    }
};


const postCliente = async (clienteData) => {
    try {
        const response = await fetch(`http://${IP}:7001/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegura que el servidor reciba JSON
            },
            body: JSON.stringify(clienteData), // Convierte los datos del cliente a JSON
        });

        // Manejar la respuesta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al crear cliente: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna la respuesta del servidor
    } catch (error) {
        console.error("Error creating client:", error);
        throw error; // Lanza el error para manejo posterior
    }
};


const putCliente = async (id_cliente, updatedData) => {
    try {
        const response = await fetch(`http://${IP}:7002/api/clientes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...updatedData, Cliente: id_cliente }), // Incluye el ID del cliente en los datos
        });

        // Manejar la respuesta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al actualizar cliente: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna la respuesta del servidor
    } catch (error) {
        console.error("Error updating client:", error);
        throw error; // Lanza el error para manejo posterior
    }
};

// MAPA /////////////////////////////////////////////////////////////////////////////////
const getTramos = async () => {
    try {
        const response = await fetch(`http://${IP}:5001/map/tramos`, { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los tramos:", error);
    }
};

const getTramosAll = async () => {
    try {
        const response = await fetch(`http://${IP}:5001/map/tramosAll`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los tramos: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los tramos con detalles:", error);
        return null;
    }
};

export { getTramosAll };

const getVias = async (tramo_id) => {
    try {
        const response = await fetch(`http://${IP}:5001/map/vias?tramo_id=${tramo_id}`, { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener las vías afectadas:", error);
    }
};

const getRuta = async (route_id) => {
    try {
        const response = await fetch(`http://${IP}:5001/map/ruta?route_id=${route_id}`, { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener la ruta:", error);
    }
};

// ANALITICA PUBLICA /////////////////////////////////////////////////////////////////////////////////
const getEfficiencyPublic = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/efficiency`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getSectorLosses = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/sector_losses`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error al obtener las pérdidas económicas por sector');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
};


const getEconomicLossPublic = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/economic_loss`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// ECONOMIC LOSS (ALL SECTORS) //////////////////////////////////////////////////////////////////////////
const getEconomicLossAll = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/economic_loss_all`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las pérdidas económicas:', error);
    }
};




const getRiskAnalysisPublic = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/risk_analysis`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getVisualizationPublic = async () => {
    try {
        const response = await fetch(`http://${IP}:5010/analytics/visualization`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {    
        console.error('Error al obtener los datos del backend:', error);
    }
}

// ANALITICA PRIVADA /////////////////////////////////////////////////////////////////////////////////
const getEfficiencyPrivate = async () => {
    try {
        const response = await fetch(`http://${IP}:5011/analytics/efficiency`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getEconomicLossPrivate = async () => {
    try {
        const response = await fetch(`http://${IP}:5011/analytics/economic_loss`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {    
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getRiskAnalysisPrivate = async () => {
    try {
        const response = await fetch(`http://${IP}:5011/analytics/risk_analysis`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// AUTHENTICATOR /////////////////////////////////////////////////////////////////////////////////
const login = async () => {
    try {
        const formData = new FormData();
        formData.append('username', 'maria');
        formData.append('password', 'maria456');

        const response = await fetch(`http://${IP}:5005/token`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const session = async () => {
    try {
        const response = await fetch(`http://${IP}:5005/users/me`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export {
    deleteCarga, getCargas, postCarga, putCarga,
    deleteCliente, getClientes, postCliente, putCliente,
    getTramos, getVias, getRuta,
    getEfficiencyPublic, getEconomicLossPublic, getRiskAnalysisPublic, getVisualizationPublic,
    getEfficiencyPrivate, getEconomicLossPrivate, getRiskAnalysisPrivate,
    login, session, getSectorLosses, getEconomicLossAll
};
