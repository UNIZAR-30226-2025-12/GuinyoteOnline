/**
 * Triunfo component
 * - This component is responsible for displaying the "triunfo" card in the game.
 * - It receives the "triunfo" prop, which contains the card information (palo and numero).
 *
 */

import Carta from "./Carta";

const Triunfo = ({ triunfo }) => {
    return(
    <div className="triunfo">
        {triunfo && (
            <Carta
                id={"triunfo"}
                key={"triunfo"}
                palo={triunfo.palo}
                numero={triunfo.numero}
                callbackClick={() => { }}
                enMano={false}
            />
        )}
    </div>
    )
}

export default Triunfo;