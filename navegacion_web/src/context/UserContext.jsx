import { createContext, useContext, useState, useEffect } from 'react';


// Creamos el contexto
const UserContext = createContext();

// Creamos el proveedor del contexto
export const UserProvider = ({ children }) => {

  // Estado inicial basado en localStorage (solo se ejecuta una vez)
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [mail, setMail] = useState(() => localStorage.getItem('mail') || '');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || 'default.png');
  const [tapete, setTapete] = useState(() => localStorage.getItem('tapete') || 'default.png');
  const [cartas, setCartas] = useState(() => localStorage.getItem('cartas') || 'default.png');
  const [stack, setStack] = useState(() => localStorage.getItem('stack') || 'default.png');
  const [isUserRegistered, setIsUserRegistered] = useState(() => {
    return localStorage.getItem('isUserRegistered') === 'true';
  });

  // Guardar en localStorage cuando los datos cambian
  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('mail', mail);
    localStorage.setItem('profilePic', profilePic);
    localStorage.setItem('tapete', tapete); 
    localStorage.setItem('cartas', cartas);
    localStorage.setItem('stack', stack);
    localStorage.setItem('isUserRegistered', JSON.stringify(isUserRegistered));
  }, [username, mail, profilePic, tapete, cartas, stack, isUserRegistered]);

  return (
    <UserContext.Provider value={{ 
      username,
      setUsername,
      mail,
      setMail,
      profilePic,
      setProfilePic,
      tapete,
      setTapete,
      cartas,
      setCartas,
      stack,
      setStack,
      isUserRegistered,
      setIsUserRegistered,
    }}>
      {children}
    </UserContext.Provider>
  );
};

function stackToCarta(stack) {
  if (stack == "default.png") {
    return stack;
  }
  else if (stack = "stack2.png"){
    return "cartas2.png";
  }
  else if (stack = "stack3.png"){
    return "cartas3.png";
  }
}

// Hook para acceder fácilmente al contexto desde cualquier componente
export const useUser = () => useContext(UserContext);
export { stackToCarta };