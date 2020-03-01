import React, { Component } from 'react';
import { socket } from '../global/Header';
import './Mapa.css';


class Mapa extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const mapa = this.props.mapa;
        console.log(mapa);
        if(mapa.row2!=undefined){
            return (
                <table className="tabla">
                    <tbody className="text-center jutify-content-center">
                        {Object.keys(mapa).map((fila) => 
                        (<tr key={fila}>
                            {Object.keys(mapa[fila]).map((columna) =>
                                (<td className={mapa[fila][columna].suelo} key={columna}>
                                    {mapa[fila][columna].suelo[0]}
                                </td>)
                            )}
                        </tr>)
                        )}
                    </tbody>
                </table>
            );
        }else {
            return(<div>Aca va el mapa</div>);
        }
    }
}

export default Mapa;