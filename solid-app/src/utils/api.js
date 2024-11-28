const IP = '34.31.197.187'; //Esta se cambia cada q se prende la instancia

// CARGAS /////////////////////////////////////////////////////////////////////////////////
const deleteCarga = async (CODIGO_CARGUE) => {
    try {
        const response = await fetch(`http://${IP}:6008/api/cargas/${CODIGO_CARGUE}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getCargas = async (limit, offset, search) => {
    try {
        const url = `http://${IP}:6010/api/cargas?limit=${limit}&offset=${offset}`;
        if (search) {
            url += `&search=${search}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const postCarga = async () => {
    try {
        const response = await fetch(`http://${IP}:6001/api/cargas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const putCarga = async (CODIGO_CARGUE) => {
    try {
        const response = await fetch(`http://${IP}:6005/api/cargas/${CODIGO_CARGUE}`, {
            method: 'PUT'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// CLIENTES /////////////////////////////////////////////////////////////////////////////////
const deleteCliente = async (id_cliente) => {
    try {
        const response = await fetch(`http://${IP}:7003/api/clientes/${id_cliente}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const getClientes = async () => {
    try {
        const response = await fetch(`http://${IP}:7000/api/clientes`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const postCliente = async () => {
    try {
        const response = await fetch(`http://${IP}:7001/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

const putCliente = async (id_cliente) => {
    try {
        const response = await fetch(`http://${IP}:7002/api/clientes/${id_cliente}`, {
            method: 'PUT'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

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
    login, session,
};
