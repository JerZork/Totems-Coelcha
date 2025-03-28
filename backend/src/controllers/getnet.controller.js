import axios from 'axios';
import qs from 'qs'; 
import { urlGetnet, clientId, clientSecret,bearerToken, sucursal, webhook } from '../config/configEnv.js';

export async function loginGetNet() { 
    try {
        const data = qs.stringify({
            clientId: clientId,
            clientSecret: clientSecret
        });

        const config = {
            method: 'post',
            url: `${urlGetnet}postxs/auth`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${bearerToken}` 
            },
            data: data
        };

        const response = await axios(config);


        console.log('Token de autenticación obtenido', );

        return response.data.data.token;

    } catch (error) {
        console.error('Error al obtener token de autenticación', error);
        return null;
    }
}

export async function PollingGetNet(idTerminal,serialNumber,Token) {
    try {
        const data = JSON.stringify({
            "idTerminal": idTerminal,
            "idSucursal": sucursal,
            "serialNumber": serialNumber,
            "command": 106,
            "customId": "1234",
            "webhook": webhook
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${urlGetnet}postxs/poll`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        return response.data; // Puedes retornar la data si la necesitas usar en otro lado
    } catch (error) {
        console.log(error);
        throw error; // Propaga el error para que pueda ser manejado por quien llama a la función
    }
}


export async function Venta(Token,idTerminal, serialNumber, amount, ticketNumber, saleType , employeeId , customId ) {
    try {
   
        const data = JSON.stringify({
            "idTerminal": idTerminal,
            "idSucursal": sucursal,
            "serialNumber": serialNumber,
            "command": 100,
            "amount": amount,
            "ticketNumber": ticketNumber,
            "printOnPos": true,
            "saleType": saleType,
            "employeeId": employeeId,
            "customId": customId,
            "webhook": "https://webhook.site/d5e09c03-098b-4a33-8a4f-77b27b2f56f3" 
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${urlGetnet}postxs/sale`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function respuesta_operacion(tsx_transaccion,Token, idTerminal,serialNumber,customId) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${urlGetnet}PosTxs/${tsx_transaccion}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
    
        };
        const response = await axios.request(config);
        console.log(response.data);
        return response;

    } catch (error) {
        try {
            let data = JSON.stringify({
                "idTerminal": idTerminal,
                "idSucursal": sucursal,
                "serialNumber": serialNumber,
                "command": 100,
                "idPosTxs": tsx_transaccion,
                "customId": customId
              });
            const config2 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${urlGetnet}PosTxs/get_transaction`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
                data: data
            };
            const response2 = await axios.request(config2);
            console.log(JSON.stringify(response2.data));
            return response2.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }
}


