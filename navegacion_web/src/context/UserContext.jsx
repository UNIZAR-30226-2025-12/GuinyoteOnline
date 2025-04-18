import { createContext, useContext, useState } from 'react';

// Creamos el contexto
const UserContext = createContext();

// Creamos el proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí guardamos los datos del usuario logueado

  const login = (userData) => {
    setUser(userData); // userData será un objeto con nombre, mail, etc.
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto desde cualquier componente
export const useUser = () => useContext(UserContext);
