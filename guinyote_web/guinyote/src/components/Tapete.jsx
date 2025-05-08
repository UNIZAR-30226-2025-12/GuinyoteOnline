import '/src/styles/Game.css';

const Tapete = () => {
    const { tapete } = useUser(); // 'tapete' será una string tipo 'tapete1', 'tapete2', etc.
    const spriteSrc = `/assets/${tapete}.png`; // construimos la ruta dinámica

    return (
        <div className='tapete'>
            <img src={spriteSrc} alt={`Tapete ${tapete}`} />
        </div>
    );
};

export default Tapete;
