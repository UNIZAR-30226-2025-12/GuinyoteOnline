import React, { useState } from 'react';
import { useUser,stackToCarta } from '../../context/UserContext';
import '/src/styles/CartasChangeModal.css'; // Asegúrate de tener este CSS o copiar el del tapete y adaptarlo
import usePut from '../../customHooks/usePut';

const stacksUrl = '/src/assets/stacks/';
const stack1 = 'stack2.png';
const stack2 = 'stack3.png';
const stack3 = 'default.png';

function CartasChangeModal({ show, handleClose }) {

  const exampleStacks = [stack1,stack2,stack3];
  const { mail, cartas, setCartas, setStack, stack } = useUser();
  const [newStack, setNewStack] = useState(stack);
  const [newCartas, setNewCartas] = useState(cartas);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    if (newStack !== stack) {
      setLoading(true);
      setErrorMsg('');
      console.log(`Stack seleccionado: ${newStack}`);
      setNewCartas(stackToCarta(newStack));
      console.log(newCartas);

      const encodedMail = encodeURIComponent(mail);
      const response = await putData({ imagen_carta: newCartas }, `/usuarios/perfil/cambiarCartas/${encodedMail}`);

      setLoading(false);

      if (response.error) {
        console.error('Error actualizando cartas:');
        setErrorMsg('Error al guardar el cambio. Intenta de nuevo.');
      } else {
        setCartas(newCartas);
        setStack(newStack);
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="cartas-modal-overlay" onClick={handleClose}>
      <div className="cartas-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cartas-options">
          {exampleStacks.map((filename) => (
            <div
              key={filename}
              className={`cartas-option ${newStack === filename ? 'selected' : ''}`}
              onClick={() => setNewStack(filename)}
            >
              <img src={stacksUrl + filename} alt={filename} />
            </div>
          ))}
        </div>

        <div className="cartas-preview">
          <h3>Vista previa</h3>
          <img src={stacksUrl + newStack} alt="Vista previa de las cartas" />
          {loading && <p className="cartas-modal-loading">Guardando...</p>}
          {errorMsg && <p className="cartas-modal-error">{errorMsg}</p>}
          <div className="cartas-modal-buttons">
            <button onClick={handleSubmit} disabled={loading}>Guardar</button>
            <button onClick={handleClose} disabled={loading}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartasChangeModal;
