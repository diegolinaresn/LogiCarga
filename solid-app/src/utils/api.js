const IP = '34.31.197.187';

// CARGAS /////////////////////////////////////////////////////////////////////////////////
export const deleteCarga = async (CODIGO_CARGUE) => {
    try {
        const response = await fetch(`http://${IP}:6008/api/cargas`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({CODIGO_CARGUE: [CODIGO_CARGUE]})
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const getCargas = async (limit, offset, search) => {
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

export const postCarga = async (cargues) => {
    try {
        const response = await fetch(`http://${IP}:6001/api/cargas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cargues: [cargues]})
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const putCarga = async (cargues) => {
    try {
        const response = await fetch(`http://${IP}:6005/api/cargas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cargues: [cargues]})
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// CLIENTES /////////////////////////////////////////////////////////////////////////////////
export const deleteCliente = async (id_cliente) => {
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

export const getClientes = async (limit, offset, search) => {
    try {
        const url = `http://${IP}:7000/api/clientes?limit=${limit}&offset=${offset}`;

        if (search) {
            url += `&search=${search}`;
        }

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const postCliente = async (cliente) => {
    try {
        const response = await fetch(`http://${IP}:7001/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const putCliente = async (cliente) => {
    try {
        const response = await fetch(`http://${IP}:7002/api/clientes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// MAPA /////////////////////////////////////////////////////////////////////////////////
export const getTramos = async () => {
    try {
        const response = await fetch(`http://${IP}:5001/map/tramos`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const getVias = async (tramo_id) => {
    try {
        const response = await fetch(`http://${IP}:5001/map/vias?tramo_id=${tramo_id}`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

export const getRuta = async (route_id) => {
    try {
        const response = await fetch(`http://${IP}:5001/map/ruta?route_id=${route_id}`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// ANALITICA PUBLICA /////////////////////////////////////////////////////////////////////////////////
export const getEfficiencyPublic = async () => {
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

export const getEconomicLossPublic = async () => {
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

export const getRiskAnalysisPublic = async () => {
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

export const getVisualizationPublic = async () => {
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
export const getEfficiencyPrivate = async () => {
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

export const getEconomicLossPrivate = async () => {
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

export const getRiskAnalysisPrivate = async () => {
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
export const signin = async (username, password) => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

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

export const session = async (token) => {
    try {
        const response = await fetch(`http://${IP}:5005/users/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
    }
}

// module.exports = {
//     deleteCarga, getCargas, postCarga, putCarga,
//     deleteCliente, getClientes, postCliente, putCliente,
//     getTramos, getVias, getRuta,
//     getEfficiencyPublic, getEconomicLossPublic, getRiskAnalysisPublic, getVisualizationPublic,
//     getEfficiencyPrivate, getEconomicLossPrivate, getRiskAnalysisPrivate,
//     signin, session,
// };