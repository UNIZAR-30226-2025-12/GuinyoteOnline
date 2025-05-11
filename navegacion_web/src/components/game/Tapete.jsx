import '/src/styles/Game.css';
import { useUser } from '../../../../navegacion_web/src/context/UserContext';

const Tapete = () => {
    const { tapete } = useUser(); // 'tapete' será una string tipo 'tapete1', 'tapete2', etc.
    const spriteSrc = `/src/assets/tapetes/${tapete}.png`; // construimos la ruta dinámica

    return (
        <div className='tapete'>
            <img src={spriteSrc} alt={`Tapete ${tapete}`} />
        </div>
    );
};

export default Tapete;
