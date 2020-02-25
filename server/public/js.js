const socket = io();

var estadoActual = {};

var elementos = {};

function cargarObjetos(pos_x, pos_y, refugios, obstaculos, llaves, palas, col) {
	refugios.forEach((refugio) => {
		if (refugio['pos_x'] == pos_x && refugio['pos_y'] == pos_y) {
			col.innerHTML = '<h5 id="' + refugio["name"] + '">' + refugio['name'] + '</h5>';
		}
	});
	obstaculos.forEach((obstaculo) => {
		if (obstaculo['pos_x'] == pos_x && obstaculo['pos_y'] == pos_y) {
			col.innerHTML = '<h5 id="' + obstaculo["name"] + '">' + obstaculo['name'] + '</h5>';
		}
	});
	llaves.forEach((llave) => {
		if (llave['pos_x'] == pos_x && llave['pos_y'] == pos_y) {
			col.innerHTML = '<h5 id="' + llave["name"] + '">' + llave['name'] + '</h5>';
		}
	});
	palas.forEach((pala) => {
		if (pala['pos_x'] == pos_x && pala['pos_y'] == pos_y) {
			col.innerHTML = '<h5 id="' + pala["name"] + '">' + pala['name'] + '</h5>';
		}
	});
}

socket.on('pos_mapa', function ({ positions_x_y, objetos }) {
	let positions = positions_x_y['positions'];
	let maxX, maxY;
	maxX = positions_x_y['max_X_Y']['max_x'];
	maxY = positions_x_y['max_X_Y']['max_y'];
	let { refugios, obstaculos, llaves, palas } = objetos;
	elementos = { refugios, obstaculos, llaves, palas };
	let estadoInicial = {};
	let pos_x_ei = document.getElementById('pos_x_ei').value;
	let pos_y_ei = document.getElementById('pos_y_ei').value;
	let orientacion_ei = document.getElementById('inputOrientacion').value;
	estadoInicial['posicion'] = { pos_x: parseInt(pos_x_ei), pos_y: parseInt(pos_y_ei) };
	estadoInicial['orientacion'] = orientacion_ei;
	estadoInicial['poseciones'] = { llaves: [], palas: [] };
	let tabla = document.getElementById('body_tabla_mapa');
	var i = 1, j = 1;
	var row, col;
	while (i <= maxX) {
		row = document.createElement('tr');
		row.setAttribute('class', 'my-3');
		while (j <= maxY) {
			col = document.createElement('td');
			if (!positions['celda(' + i + ',' + j + ')']) {
				col.setAttribute('class', 'celda ');
			} else {
				switch (positions['celda(' + i + ',' + j + ')']['suelo']) {
					case 'firme': {
						col.setAttribute('class', 'celda text-white bg-success mx-3 p-3 text-center');
						cargarObjetos(i, j, refugios, obstaculos, llaves, palas, col);
						break;
					}
					case 'lava': {
						col.setAttribute('class', 'celda text-white bg-danger mx-3 p-3 text-center');
						// si es lava no puede haber objectos asique ni siquiera llamo a la funcion
						break;
					}
					case 'resbaladizo': {
						col.setAttribute('class', 'celda text-white bg-warning mx-3 p-3 text-center');
						cargarObjetos(i, j, refugios, obstaculos, llaves, palas, col);
						break;
					}
				}
				if (estadoInicial['posicion']['pos_x'] == i && estadoInicial['posicion']['pos_y'] == j) {
					let img;
					switch (estadoInicial['orientacion']) {
						case 'N': {
							img = document.getElementById('arrow_north');
							img.style.visibility = 'visible';
							col.appendChild(img);
							break;
						}
						case 'O': {
							img = document.getElementById('arrow_west');
							img.style.visibility = 'visible';
							col.appendChild(img);
							break;
						}
						case 'S': {
							img = document.getElementById('arrow_south');
							img.style.visibility = 'visible';
							col.appendChild(img);
							break;
						}
						case 'E': {
							img = document.getElementById('arrow_east');
							img.style.visibility = 'visible';
							col.appendChild(img);
							break;
						}
					}
				}
			}
			col.setAttribute('id', 'celda(' + i + ',' + j + ')');
			row.appendChild(col);
			j++;
		}
		tabla.appendChild(row);
		j = 1;
		i++;
	}
	estadoActual = estadoInicial;
	document.getElementById('btn_cargar_mapa').setAttribute('disabled', 'true');
});

function actualizarEstadoTablaAvanzar(NewState) {
	let old_celda = document.getElementById('celda(' + estadoActual['posicion']['pos_x'] + ',' + estadoActual['posicion']['pos_y'] + ')');
	let old_image = old_celda.lastChild;
	old_celda.removeChild(old_image);
	let new_celda = document.getElementById('celda(' + NewState['posicion']['pos_x'] + ',' + NewState['posicion']['pos_y'] + ')');
	new_celda.appendChild(old_image);
	estadoActual['posicion'] = NewState['posicion'];
	estadoActual['orientacion'] = NewState['orientacion'];
	estadoActual['poseciones'] = NewState['poseciones'];
}

function changeStateAvanzar(suelo, pos_x_futura, pos_y_futura, codigoRefugio) {
	let NewState = {};
	// si uso una llave para avanzar a un refugio actualizo la cantidad de accesos a una llave
	NewState['poseciones'] = estadoActual['poseciones'];
	if (codigoRefugio == 2) {
		let indice_mod = 0;
		NewState['poseciones']['llaves'].some((llave, index) => {
			if (llave['accesos'] > 0) {
				indice_mod = index;
				return true;
			}
		});
		NewState['poseciones']['llaves'][indice_mod]['accesos'] = NewState['poseciones']['llaves'][indice_mod]['accesos'] - 1;
	}
	switch (suelo) {
		case 'firme': {
			NewState['posicion'] = { pos_x: pos_x_futura, pos_y: pos_y_futura };
			NewState['orientacion'] = estadoActual['orientacion'];
			NewState['poseciones'] = estadoActual['poseciones'];
			actualizarEstadoTablaAvanzar(NewState);
			break;
		}
		case 'lava': {
			console.log('ERROR Avanzar: Lava en celda(' + pos_x_futura + ',' + pos_y_futura + ')');
			break;
		}
		case 'resbaladizo': {
			NewState['posicion'] = { pos_x: pos_x_futura, pos_y: pos_y_futura };
			NewState['orientacion'] = estadoActual['orientacion'];
			NewState['poseciones'] = estadoActual['poseciones'];
			actualizarEstadoTablaAvanzar(NewState);
			break;
		}
	}
}

function avanzar() {
	let pos_x_futura, pos_y_futura;
	let actual_x = estadoActual['posicion']['pos_x'];
	let actual_y = estadoActual['posicion']['pos_y'];
	switch (estadoActual['orientacion']) {
		case 'N': {
			pos_x_futura = actual_x - 1;
			pos_y_futura = actual_y;
			break;
		}
		case 'O': {
			pos_x_futura = actual_x;
			pos_y_futura = actual_y - 1;
			break;
		}
		case 'S': {
			pos_x_futura = actual_x + 1;
			pos_y_futura = actual_y;
			break;
		}
		case 'E': {
			pos_x_futura = actual_x;
			pos_y_futura = actual_y + 1;
			break;
		}
	}
	// aca le pregunto al servidor por la posicion y me responde el ACK en la callback
	socket.emit('check_avanzar', { pos_x_f: pos_x_futura, pos_y_f: pos_y_futura },
		function ({ valid, suelo, obstaculo, refugio }) {
			if (valid) {
				if (!obstaculo['hayObstaculo']) {
					// si no hay refugio o si el refugio no requiere llave o si requiere llave pero tengo una llave con accesos disponibles
					if (!refugio['hayRefugio']) {
						changeStateAvanzar(suelo, pos_x_futura, pos_y_futura, 0);
					} else {
						if (refugio['reqLlave'] == 'no') {
							changeStateAvanzar(suelo, pos_x_futura, pos_y_futura, 1);
						} else {
							let tengoLlave = estadoActual['poseciones']['llaves'].some((llave, index) => {
								return llave['accesos'] > 0;
							});
							if (tengoLlave) {
								// hay que elegir una llave y decrementarle la cantidad de accesos
								changeStateAvanzar(suelo, pos_x_futura, pos_y_futura, 2);
							} else {
								console.log('ERROR Avanzar: Refugio[' + refugio['name'] +
									'] en celda(' + pos_x_futura + ',' + pos_y_futura + ') NO HAY LLAVE con Accesos');
							}
						}
					}
				} else {
					console.log('ERROR Avanzar: obstaculo [' + obstaculo['name'] +
						'] en celda(' + pos_x_futura + ',' + pos_y_futura + ')');
				}

			} else {
				console.log('ERROR Saltar: NO EXISTE la Celda(' + pos_x_futura + ',' + pos_y_futura + ')');
			}
		});
}

function changeStateSaltar(suelo, pos_x_futura, pos_y_futura, codigoLava) {
	let NewState = {};
	switch (suelo) {
		case 'firme': {
			NewState['posicion'] = { pos_x: pos_x_futura, pos_y: pos_y_futura };
			NewState['orientacion'] = estadoActual['orientacion'];
			NewState['poseciones'] = estadoActual['poseciones'];
			actualizarEstadoTablaAvanzar(NewState);
			break;
		}
		case 'lava': {
			console.log('ERROR: Saltar: Lava en Celda(' + pos_x_futura + ',' + pos_y_futura + ')');
			break;
		}
		case 'resbaladizo': {
			if (codigoLava == 0) {
				NewState['posicion'] = { pos_x: pos_x_futura, pos_y: pos_y_futura };
				NewState['orientacion'] = estadoActual['orientacion'];
				NewState['poseciones'] = estadoActual['poseciones'];
				actualizarEstadoTablaAvanzar(NewState);
			} else {
				console.log("ERROR Saltar: Celda(" + pos_x_futura + "," + pos_y_futura + ") no es firme");
			}
			break;
		}
	}
}

function saltar() {
	let pos_x_futura, pos_y_futura, pos_x_int, pos_y_int;
	let actual_x = estadoActual['posicion']['pos_x'];
	let actual_y = estadoActual['posicion']['pos_y'];
	switch (estadoActual['orientacion']) {
		case 'N': {
			pos_x_futura = actual_x - 2;
			pos_y_futura = actual_y;
			pos_x_int = actual_x - 1;
			pos_y_int = actual_y;
			break;
		}
		case 'O': {
			pos_x_futura = actual_x;
			pos_y_futura = actual_y - 2;
			pos_x_int = actual_x;
			pos_y_int = actual_y - 1;
			break;
		}
		case 'S': {
			pos_x_futura = actual_x + 2;
			pos_y_futura = actual_y;
			pos_x_int = actual_x + 1;
			pos_y_int = actual_y;
			break;
		}
		case 'E': {
			pos_x_futura = actual_x;
			pos_y_futura = actual_y + 2;
			pos_x_int = actual_x;
			pos_y_int = actual_y + 1;
			break;
		}
	}
	// aca le pregunto al servidor por la posicion y me responde el ACK en la callback
	socket.emit('check_saltar', { pos_x_f: pos_x_futura, pos_y_f: pos_y_futura, pos_x_i: pos_x_int, pos_y_i: pos_y_int },
		function ({ valid, suelo, obstaculo, lava }) {
			if (valid) {
				if (obstaculo['hayObstaculo']) {
					// puedo saltar si la altura del obstaculo es menor a 5
					if (obstaculo['altura'] < 5) {
						changeStateSaltar(suelo, pos_x_futura, pos_y_futura, 0);
					} else {
						console.log("ERROR Saltar: El obstaculo[" + obstaculo['name'] + "], Atura:" +
							obstaculo['altura'] + " MUY ALTO");
					}
				}
				else {
					if (lava) {
						changeStateSaltar(suelo, pos_x_futura, pos_y_futura, 1);
					} else {
						console.log("ERROR Saltar: Celda(" + pos_x_int + "," + pos_y_int + ") no hay lava ni obstaculo");
					}

				}
			} else {
				console.log('ERROR Saltar: No EXISTE la Celda(' + pos_x_futura + ',' + pos_y_futura + ')');
			}
		});
}


function levantar_llave() {
	let hay_llave = false;
	let index_llave_to_remove;
	elementos['llaves'].forEach((llave, index) => {
		if (llave['pos_x'] == estadoActual['posicion']['pos_x'] && llave['pos_y'] == estadoActual['posicion']['pos_y']) {
			hay_llave = true;
			index_llave_to_remove = index;
		}
	});
	if (hay_llave) {
		// agrego la llave a las poseciones del estadoActual
		estadoActual['poseciones']['llaves'].push(elementos['llaves'][index_llave_to_remove]);
		// si hay llave la levanto no importa la cantidad de accesos
		let celda = document.getElementById('celda(' + elementos['llaves'][index_llave_to_remove]['pos_x'] +
			',' + elementos['llaves'][index_llave_to_remove]['pos_y'] + ')');
		let llave = document.getElementById(elementos['llaves'][index_llave_to_remove]['name']);
		celda.removeChild(llave);
		elementos['llaves'].splice(index_llave_to_remove, 1);

		//console.log(estadoActual['poseciones']);
	} else {
		console.log('No hay LLAVE');
	}
}

function levantar_pala() {
	let hay_pala = false;
	let index_pala_to_remove;
	elementos['palas'].forEach((pala, index) => {
		// si en la pos actual hay una pala la saco de la GUI
		if (pala['pos_x'] == estadoActual['posicion']['pos_x'] && pala['pos_y'] == estadoActual['posicion']['pos_y']) {
			hay_pala = true;
			index_pala_to_remove = index;
		}
	});
	if (hay_pala) {
		// agrego la pala a las poseciones del estadoActual
		estadoActual['poseciones']['palas'].push(elementos['palas'][index_pala_to_remove]);
		// si hay pala la levanto no importa la cantidad de accesos
		let celda = document.getElementById('celda_(' + elementos['palas'][index_pala_to_remove]['pos_x'] +
			',' + elementos['palas'][index_pala_to_remove]['pos_y'] + ')');
		let pala = document.getElementById(elementos['palas'][index_pala_to_remove]['name']);
		celda.removeChild(pala);
		elementos['palas'].splice(index_pala_to_remove, 1);
	} else {
		console.log('No hay PALA');
	}
}

function obtenerImagenDeCelda() {
	let imagen;
	switch (estadoActual['orientacion']) {
		case 'N': {
			imagen = document.getElementById('arrow_north');
			break;
		}
		case 'O': {
			imagen = document.getElementById('arrow_west');
			break;
		}
		case 'S': {
			imagen = document.getElementById('arrow_south');
			break;
		}
		case 'E': {
			imagen = document.getElementById('arrow_east');
			break;
		}
	}
	return imagen;
}

function actualizarEstadoTablaGirar(value) {
	//console.log(estadoActual);

	let celda = document.getElementById('celda(' + estadoActual['posicion']['pos_x'] + ',' + estadoActual['posicion']['pos_y'] + ')');
	let old_image = obtenerImagenDeCelda();
	celda.removeChild(old_image);
	document.getElementById('imagenes').appendChild(old_image);
	let new_image;
	switch (value) {
		case 'N': {
			new_image = document.getElementById('arrow_north');
			break;
		}
		case 'O': {
			new_image = document.getElementById('arrow_west');
			break;
		}
		case 'S': {
			new_image = document.getElementById('arrow_south');
			break;
		}
		case 'E': {
			new_image = document.getElementById('arrow_east');
			break;
		}
	}
	estadoActual['orientacion'] = value;
	celda.appendChild(new_image);
}

/*  ---------------------- OYENTES ------------------------------- */

let btn_cargar_mapa = document.getElementById('btn_cargar_mapa');
btn_cargar_mapa.addEventListener('click', () => {
	socket.emit('cargar_mapa', null);
});

let btn_avanzar = document.getElementById('btn_avanzar');
btn_avanzar.addEventListener('click', avanzar);

let btn_saltar = document.getElementById('btn_saltar');
btn_saltar.addEventListener('click', saltar);

let btn_levantar_llave = document.getElementById('btn_levantar_llave');
btn_levantar_llave.addEventListener('click', levantar_llave);

let btn_levantar_pala = document.getElementById('btn_levantar_pala');
btn_levantar_pala.addEventListener('click', levantar_pala);

let bnt_girar_N = document.getElementById('btn_girar_n');
bnt_girar_N.addEventListener('click', () => actualizarEstadoTablaGirar(bnt_girar_N.value));

let bnt_girar_O = document.getElementById('btn_girar_o');
bnt_girar_O.addEventListener('click', () => actualizarEstadoTablaGirar(bnt_girar_O.value));

let bnt_girar_S = document.getElementById('btn_girar_s');
bnt_girar_S.addEventListener('click', () => actualizarEstadoTablaGirar(bnt_girar_S.value));

let bnt_girar_E = document.getElementById('btn_girar_e');
bnt_girar_E.addEventListener('click', () => actualizarEstadoTablaGirar(bnt_girar_E.value));

document.addEventListener('keypress', (event) => {

});