import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Mapa from './Components/Mapa';
import EstadoInicial from './Components/EstadoInicial';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header, socket } from "./global/header";
import { Container, Row, Col } from 'react-bootstrap';

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			mapa:{
				fila1:{
					col1:{
						pos_x:1,
						pos_y:1,
						suelo:"firme"
					}
				}
			}
		};
	}

	getData = mapa => {
		this.setState({mapa: mapa});
	}

	componentDidMount() {
		socket.emit('init');
		var state_current = this;
		socket.on("get_data",state_current.getData);
	}

	load_map() {
		socket.emit('load_map');
	}

	render() {
		return (
			<Container>
				<Header/>
				<Mapa mapa={this.state.mapa}></Mapa>
				<Row>
					<Col><EstadoInicial load_map={this.load_map}/></Col>
					<Col>Otra Cosa</Col>
					<Col>Otra Cosa</Col>
					<Col>Otra Cosa</Col>
					<Col>Otra Cosa</Col>
				</Row>
			</Container>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));