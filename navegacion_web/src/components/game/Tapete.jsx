import '/src/styles/Game.css';

const Tapete = () => {
    
    const spriteSrc = `/src/assets/tapete1.png`; // construimos la ruta dinámica

    return (
        <div className='tapete'>
            <img src={spriteSrc} alt={'Tapete' } />
        </div>
    );
};

export default Tapete;
