import { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
const UserContext = createContext();

// Creamos el proveedor del contexto
export const UserProvider = ({ children }) => {

  // Estado inicial basado en localStorage (solo se ejecuta una vez)
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [mail, setMail] = useState(() => localStorage.getItem('mail') || '');
  const [isUserRegistered, setIsUserRegistered] = useState(() => {
    return localStorage.getItem('isUserRegistered') === 'true';
  });

  // Guardar en localStorage cuando los datos cambian
  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('mail', mail);
    localStorage.setItem('isUserRegistered', JSON.stringify(isUserRegistered));
  }, [username, mail, isUserRegistered]);

  return (
    <UserContext.Provider value={{ username, setUsername, mail, setMail, isUserRegistered, setIsUserRegistered }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto desde cualquier componente
export const useUser = () => useContext(UserContext);
