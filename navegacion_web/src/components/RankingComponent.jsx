import React, { Component } from 'react';
import '../styles/RankingComponent.css';
import RankingRow from './RankingRow';

class RankingComponent extends Component {
    constructor(props) {
        super(props);

        const { username } = this.props;

        this.state = {
            rankings: [
            { victorias: 100, usuario: 'hector' },
            { victorias: 99, usuario: 'juan' },
            { victorias: 98, usuario: 'pedro' },
            { victorias: 97, usuario: 'luis' },
            { victorias: 96, usuario: 'jose' }
            ],
            usrRanking: username !== '' ? { ranking: 1, victorias: 100, usuario: username } : { ranking: '-', victorias: '-', usuario: '-' }
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.username !== this.props.username) {
            const { username } = this.props;
            this.setState({
                usrRanking: username !== '' ? { ranking: 1, victorias: 100, usuario: username } : { ranking: '-', victorias: '-', usuario: '-' }
            });
        }
    }

    componentDidMount() {
        // Fetch rankings data here

    }

    render() {

        const { show, handleClose } = this.props;

        if (!show) {
            return null;
        }

        return (

            <div className={`ranking-overlay ${show ? 'show' : 'hide'}`}>
                <div className={`ranking-modal ${show ? 'show' : 'hide'}`}>
                    <button className='modal-exit-button' onClick={handleClose} >
                        <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                    </button>
                    <h1>Rankings</h1>
                    <table className='ranking-table'>
                        <thead>
                        <tr key={0}>
                            <th>Posición</th>
                            <th>Usuario</th>
                            <th>Victorias</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.rankings.map((ranking, index) => (                                    
                                <RankingRow keyValue={index+1} ranking={index+1} usuario={ranking.usuario} victorias={ranking.victorias} />
                            ))}
                            <RankingRow keyValue={99999} ranking={this.state.usrRanking.ranking} usuario={this.state.usrRanking.usuario} victorias={this.state.usrRanking.victorias} />
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RankingComponent;