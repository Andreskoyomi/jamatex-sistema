import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si NO hay token, lo mandamos de patitas al login
    if (!token) {
        return <Navigate to="/" />;
    }

    // Si hay token, lo dejamos ver el contenido (el Dashboard)
    return children;
};

export default RutaProtegida;