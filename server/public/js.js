const socket = io();

var mapa_cargado = false;

function cargarObjetos(pos_x, pos_y, col, elementos) {
	let { refugios, obstaculos, llaves, palas } = elementos;
	let img;
	refugios.forEach((refugio) => {
		if (refugio['pos_x'] == pos_x && refugio['pos_y'] == pos_y) {
			//col.innerHTML = '<h5 id="' + refugio["name"] + '">' + refugio['name'] + '</h5>';
			img = document.createElement('img');
			img.setAttribute('src', 'images/tent.svg');
			img.setAttribute('id', refugio["name"] + '_image');
			img.setAttribute('style', 'width:15px; height:15px;');
			col.appendChild(img);
		}
	});
	obstaculos.forEach((obstaculo) => {
		if (obstaculo['pos_x'] == pos_x && obstaculo['pos_y'] == pos_y) {
			//col.innerHTML = '<h5 id="' + obstaculo["name"] + '">' + obstaculo['name'] + '</h5>';
			//img = document.getElementById('obstaculo_image');
			img = document.createElement('img');
			img.setAttribute('src', 'images/box.svg');
			img.setAttribute('id', obstaculo["name"] + '_image');
			img.setAttribute('style', 'width:15px; height:15px;');
			col.appendChild(img);
		}
	});
	llaves.forEach((llave) => {
		if (llave['pos_x'] == pos_x && llave['pos_y'] == pos_y) {
			//col.innerHTML = '<h5 id="' + llave["name"] + '">' + llave['name'] + '</h5>';
			//img = document.getElementById('llave_image');
			img = document.createElement('img');
			img.setAttribute('src', 'images/key.svg');
			img.setAttribute('id', 'celda(' + llave['pos_x'] + ',' + llave['pos_y'] + ')_llave');
			img.setAttribute('style', 'width:15px; height:15px;');
			col.appendChild(img);
		}
	});
	palas.forEach((pala) => {
		if (pala['pos_x'] == pos_x && pala['pos_y'] == pos_y) {
			//col.innerHTML = '<h5 id="' + pala["name"] + '">' + pala['name'] + '</h5>';
			//img = document.getElementById('pala_image');
			img = document.createElement('img');
			img.setAttribute('src', 'images/pala.svg');
			img.setAttribute('id', 'celda(' + pala['pos_x'] + ',' + pala['pos_y'] + ')_pala');
			img.setAttribute('style', 'width:15px; height:15px;');
			col.appendChild(img);
		}
	});
}

function cargar_mapa() {
	let estadoInicialJugador = {};
	let estadoInicialIA = {};

	let orientacion_ei_j = document.getElementById('inputOrientacion_j').value;
	let orientacion_ei_ia = document.getElementById('inputOrientacion_ia').value;
	estadoInicialJugador['posicion'] = {
		pos_x: parseInt(document.getElementById('pos_x_ei_j').value),
		pos_y: parseInt(document.getElementById('pos_y_ei_j').value)
	};
	estadoInicialJugador['orientacion'] = orientacion_ei_j;
	estadoInicialJugador['poseciones'] = { llaves: [], palas: [] };
	estadoInicialJugador['camino'] = [];
	estadoInicialJugador['costo'] = 0;

	estadoInicialIA['posicion'] = {
		pos_x: parseInt(document.getElementById('pos_x_ei_ia').value),
		pos_y: parseInt(document.getElementById('pos_y_ei_ia').value)
	};
	estadoInicialIA['orientacion'] = orientacion_ei_ia;
	estadoInicialIA['poseciones'] = { llaves: [], palas: [] };
	estadoInicialIA['camino'] = [];
	estadoInicialIA['costo'] = 0;

	let tabla = document.getElementById('body_tabla_mapa');
	let rowElement, colElement;

	/* CALLBACK Servidor */
	socket.emit('load_map', { estadoInicialJugador, estadoInicialIA },
		({ mapa, valid, objetos }) => {
			if (valid.valid_j) {
				if (valid.valid_ia) {
					Object.keys(mapa).map((row, indexRow) => {
						rowElement = document.createElement('tr');
						Object.keys(mapa[row]).map((col, indexCol) => {
							colElement = document.createElement('td');
							colElement.setAttribute('id', mapa[row][col].name);
							switch (mapa[row][col].suelo) {
								case 'firme': {
									colElement.setAttribute('class', 'celda text-white bg-success p-3 text-center');
									cargarObjetos(indexRow + 1, indexCol + 1, colElement, objetos);
									break;
								}
								case 'lava': {
									colElement.setAttribute('class', 'celda text-white bg-danger p-3 text-center');
									break;
								}
								case 'resbaladizo': {
									colElement.setAttribute('class', 'celda text-white bg-warning p-3 text-center');
									cargarObjetos(indexRow + 1, indexCol + 1, colElement, objetos);
									break;
								}
							}
							if (estadoInicialJugador['posicion']['pos_x'] == (indexRow + 1) &&
								estadoInicialJugador['posicion']['pos_y'] == (indexCol + 1)) {
								let img;
								switch (estadoInicialJugador['orientacion']) {
									case 'N': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_north.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialJugador['posicion']['pos_x'] + ',' +
											estadoInicialJugador['posicion']['pos_y'] + ')_j_N');
										//img = document.getElementById('arrow_north_j');
										colElement.appendChild(img);
										break;
									}
									case 'O': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_west.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialJugador['posicion']['pos_x'] + ',' +
											estadoInicialJugador['posicion']['pos_y'] + ')_j_O');
										colElement.appendChild(img);
										break;
									}
									case 'S': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_south.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialJugador['posicion']['pos_x'] + ',' +
											estadoInicialJugador['posicion']['pos_y'] + ')_j_S');
										colElement.appendChild(img);
										break;
									}
									case 'E': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_east.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialJugador['posicion']['pos_x'] + ',' +
											estadoInicialJugador['posicion']['pos_y'] + ')_j_E');
										colElement.appendChild(img);
										break;
									}
								}
							}
							if (estadoInicialIA['posicion']['pos_x'] == (indexRow + 1) &&
								estadoInicialIA['posicion']['pos_y'] == (indexCol + 1)) {
								let img;
								switch (estadoInicialIA['orientacion']) {
									case 'N': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_north.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialIA['posicion']['pos_x'] + ',' +
											estadoInicialIA['posicion']['pos_y'] + ')_ia_N');
										colElement.appendChild(img);
										break;
									}
									case 'O': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_west.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialIA['posicion']['pos_x'] + ',' +
											estadoInicialIA['posicion']['pos_y'] + ')_ia_O');
										colElement.appendChild(img);
										break;
									}
									case 'S': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_south.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialIA['posicion']['pos_x'] + ',' +
											estadoInicialIA['posicion']['pos_y'] + ')_ia_S');
										colElement.appendChild(img);
										break;
									}
									case 'E': {
										img = document.createElement('img');
										img.setAttribute('src', 'images/arrow_east.png');
										img.setAttribute('style', 'width:15px; height:15px;');
										img.setAttribute('id', 'celda(' + estadoInicialIA['posicion']['pos_x'] + ',' +
											estadoInicialIA['posicion']['pos_y'] + ')_ia_E');
										colElement.appendChild(img);
										break;
									}
								}
							}
							rowElement.appendChild(colElement);
						});
						tabla.appendChild(rowElement);
					});
					document.getElementById('btn_cargar_mapa').setAttribute('disabled', 'true');
					document.getElementById('btn_cargar_mapa').setAttribute('class', 'btn-disabled btn-block rounded ');
					mapa_cargado = true;
				} else {
					console.log("ERROR Cargar Mapa: La Posición de la IA indicada no es válida");
				}
			} else {
				console.log("ERROR Cargar Mapa: La Posición del Jugador indicada no es válida");
			}
		});
}

function actualizarEstado(estado, entidad) {
	document.getElementById('estado_pos_x_' + entidad).innerHTML = estado['posicion']['pos_x'];
	document.getElementById('estado_pos_y_' + entidad).innerHTML = estado['posicion']['pos_y'];
	document.getElementById('estado_orientacion_' + entidad).innerHTML = estado['orientacion'];
	var html_camino = "";
	estado['camino'].forEach((camino) => {
		html_camino = html_camino + "<li>" + camino + "</li>";
	});
	document.getElementById('estado_camino_' + entidad).innerHTML = html_camino;
	document.getElementById('estado_costo_' + entidad).innerHTML = estado['costo'];
	var html_llaves = "";
	estado['poseciones']['llaves'].forEach((llave) => {
		html_llaves = html_llaves + "<li>llave(" + llave['name'] + "," + llave['accesos'] + ")</li>";
	});
	document.getElementById('estado_llaves_' + entidad).innerHTML = html_llaves;
	var html_palas = "";
	estado['poseciones']['palas'].forEach((pala) => {
		html_palas = html_palas + "<li>pala(" + pala['name'] + ")</li>";
	});
	document.getElementById('estado_palas_' + entidad).innerHTML = html_palas;
}

function actualizarMapa(orientacion, elementsId) {
	let old_celda = document.getElementById(elementsId.celda.old);
	let old_image = document.getElementById(elementsId.image.old);
	let node_image = null;
	old_celda.childNodes.forEach((node) => {
		if (node == old_image) {
			node_image = node;
		}
	});
	if (node_image != null) {
		old_celda.removeChild(node_image);
	}
	// si no son llaves o palas
	if (elementsId.celda.new != null && elementsId.image.new != null) {
		let new_celda = document.getElementById(elementsId.celda.new);
		let new_image = document.createElement('img');
		switch (orientacion) {
			case 'N': {
				new_image.setAttribute('src', 'images/arrow_north.png');
				break;
			}
			case 'O': {
				new_image.setAttribute('src', 'images/arrow_west.png');
				break;
			}
			case 'S': {
				new_image.setAttribute('src', 'images/arrow_south.png');
				break;
			}
			case 'E': {
				new_image.setAttribute('src', 'images/arrow_east.png');
				break;
			}
		}
		new_image.setAttribute('style', 'width:15px; height:15px;');
		new_image.setAttribute('id', elementsId.image.new);
		new_celda.appendChild(new_image);
	}
}

function avanzar() {
	if (mapa_cargado) {
		// aca le pregunto al servidor por la posicion y me responde el ACK en la callback
		socket.emit('avanzar_jugador',
			/* CALLBACK del Servidor */
			({ error, msg, elementsId, estado }) => {
				switch (error) {
					case 0: {
						actualizarMapa(estado['orientacion'], elementsId);
						actualizarEstado(estado, 'j');
						jugarIA();
						break;
					}
					case 1: 
					case 2: 
					case 3: 
					case 4: {
						console.log(msg);
						break;
					}
				}
			});
	} else {
		console.log("ERROR: El mapa no esta cargado");
	}
}

function saltar() {
	if (mapa_cargado) {
		// aca le pregunto al servidor por la posicion y me responde el ACK en la callback
		// aca le pregunto al servidor por la posicion y me responde el ACK en la callback
		socket.emit('saltar_jugador',
			/* CALLBACK del Servidor */
			({ error, msg, elementsId, estado }) => {
				switch (error) {
					case 0: {
						actualizarMapa(estado['orientacion'], elementsId);
						actualizarEstado(estado, 'j');
						jugarIA();
						break;
					}
					case 1: 
					case 2:
					case 3: 
					case 4: 
					case 5: 
					case 6: {
						console.log(msg);
						break;
					}
				}
			});
		} else {
			console.log("ERROR: El mapa no esta cargado");
		}
}

function levantar_llave() {
	if (mapa_cargado) {
		socket.emit('levantar_llave',
			({ error, msg, elementsId, estado }) => {
				if (error == 0) {
					actualizarMapa(0, elementsId);
					actualizarEstado(estado, 'j');
					jugarIA();
				} else if (error = 1) {
					console.log(msg);
				}
			});
	} else {
		console.log("ERROR: El mapa no esta cargado");
	}
}

function levantar_pala() {
	if (mapa_cargado) {
		socket.emit('levantar_pala',
			({ error, msg, elementsId, estado }) => {
				if (error == 0) {
					actualizarMapa(0, elementsId);
					actualizarEstado(estado, 'j');
					jugarIA();
				} else if (error = 1) {
					console.log(msg);
				}
			});
	} else {
		console.log("ERROR: El mapa no esta cargado");
	}
}

function girar(value) {
	if (mapa_cargado) {
		socket.emit('girar', { orientacion: value },
			({ elementsId, estado }) => {
				actualizarMapa(value, elementsId);
				actualizarEstado(estado, 'j');
				jugarIA();
			});
	} else {
		console.log("ERROR: El mapa no esta cargado");
	}
}

/*  ---------------------- OYENTES ------------------------------- */

let btn_cargar_mapa = document.getElementById('btn_cargar_mapa');
btn_cargar_mapa.addEventListener('click', cargar_mapa);

let btn_avanzar = document.getElementById('btn_avanzar');
btn_avanzar.addEventListener('click', avanzar);

let btn_saltar = document.getElementById('btn_saltar');
btn_saltar.addEventListener('click', saltar);

let btn_levantar_llave = document.getElementById('btn_levantar_llave');
btn_levantar_llave.addEventListener('click', levantar_llave);

let btn_levantar_pala = document.getElementById('btn_levantar_pala');
btn_levantar_pala.addEventListener('click', levantar_pala);

let bnt_girar_N = document.getElementById('btn_girar_n');
bnt_girar_N.addEventListener('click', () => girar(bnt_girar_N.value));

let bnt_girar_O = document.getElementById('btn_girar_o');
bnt_girar_O.addEventListener('click', () => girar(bnt_girar_O.value));

let bnt_girar_S = document.getElementById('btn_girar_s');
bnt_girar_S.addEventListener('click', () => girar(bnt_girar_S.value));

let bnt_girar_E = document.getElementById('btn_girar_e');
bnt_girar_E.addEventListener('click', () => girar(bnt_girar_E.value));

document.addEventListener('keypress', (event) => {

});

/**
 * ******************************   IA   *****************************
 */

function jugarIA() {
	socket.emit('jugar_IA', 
		({ accion, elementsId, estado }) => {
			switch(accion) {
				case 'avanzar': {
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
				case 'saltar_lava': {
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
				case 'saltar_obstaculo': {
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
				case 'girar': {
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
				case 'levantar_llave': {
					console.log(estado);
					console.log(elementsId);
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
				case 'levantar_pala': {
					actualizarMapa(estado['orientacion'], elementsId);
					actualizarEstado(estado, 'ia');
					break;
				}
			}
		});
}