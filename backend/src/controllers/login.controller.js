import { checkLogin } from '../Services/clienteDetalle.service.js';
export const LogUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;
     
        const user = await checkLogin(username, password);
        
        
        if (user) {
            res.status(200).json(user); ;
        } else {
            res.status(404).json({ message: 'False' });
        }
    } catch (error) {
        console.error('Error al verificar existencia de usuario', error);
        res.status(500).json({ message: 'Error al verificar existencia de usuario' });
    }
}