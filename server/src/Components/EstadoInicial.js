import React, { Component } from 'react';
import {soket} from '../global/Header';
import { Card, InputGroup, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap';

class EstadoInicial extends Component {
	componentDidMount() {
	}

	handleClick = (event) => {
		
	}

	render() {
		return (
			<Card className="text-center">
				<Card.Header>Estado Inicial</Card.Header>
				<Card.Body>
					<Card.Title>Posición</Card.Title>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">X</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							aria-label="Small"
							aria-describedby="inputGroup-sizing-sm"
							placeholder="Coordenada X"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">Y</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							aria-label="Small"
							aria-describedby="inputGroup-sizing-sm"
							placeholder="Coordenada X"
						/>
					</InputGroup>
					<Card.Title>Orientación</Card.Title>
					<DropdownButton 
						id="dropdown-basic-button" 
						title="Orientación" 
						variant="outline-secondary"
					>
						<Dropdown.Item value="N">Norte</Dropdown.Item>
						<Dropdown.Item value="O">Oeste</Dropdown.Item>
						<Dropdown.Item value="S">Sur</Dropdown.Item>
						<Dropdown.Item value="E">Este</Dropdown.Item>
					</DropdownButton>
					<Button variant="primary" onClick={this.props.load_map}>Cargar Mapa</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default EstadoInicial;