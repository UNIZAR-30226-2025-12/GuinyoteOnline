import '../styles/Game.css'

const Tapete = () => {

    const spriteSrc = '/assets/Tapete.png';

    return (
        <div className='tapete'>
            <img src={spriteSrc} alt='Tapete' />
        </div>
    );
}
export default Tapete;