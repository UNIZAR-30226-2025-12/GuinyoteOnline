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