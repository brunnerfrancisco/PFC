const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const swipl = require('swipl');
const SerialPort = require('serialport');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

// en linux /dev/tty(algo)
const port = new SerialPort('COM5', {
	baudRate: 9600
});

//swipl.call('consult("busqueda.pl")');

app.set('port', process.env.PORT || 3001);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
	console.log('server listening on port', app.get('port'));
});

let query = null;
let ret = null;

let estadoJugador = {};
let estadoIA = {};
let elementos = {};

/**
 * Obtiene las celdas del mapa de la IA
 */
function obtenerMapa() {
	let mapa = {};
	query = new swipl.Query('celda([X,Y],Suelo).');
	ret = null;
	while (ret = query.next()) {
		if (mapa['row' + ret.X] == undefined) {
			mapa['row' + ret.X] = {};
		}
		mapa['row' + ret.X]['col' + ret.Y] = {
			name: 'celda(' + ret.X + ',' + ret.Y + ')',
			pos_x: ret.X,
			pos_y: ret.Y,
			suelo: ret.Suelo
		}
	}
	query.close();
	return mapa;
}

/**
 * Chequea si la posicion corresponde a una celda en el mapa
*/
function validarPosicionIncial(pos_x, pos_y) {
	let valid = false;
	query = new swipl.Query('celda([' + pos_x + ',' + pos_y + '],Suelo).');
	ret = null;
	if (ret = query.next()) {
		valid = true;
	}
	query.close();
	return valid;
}

/**
 * Obtiene los objetos(refugios, obstaculos, llaves, palas) del mapa de la IA
 */
function obtenerObjetosEnMapa() {
	query = new swipl.Query('estaEn(Obj,[X,Y])');
	ret = null;
	let refugios = [], obstaculos = [], llaves = [], palas = [];
	while (ret = query.next()) {
		switch (ret.Obj['head']) {
			case 'r': {
				refugios.push({
					pos_x: ret.X,
					pos_y: ret.Y,
					name: ret.Obj['tail']['head'],
					req_key: ret.Obj['tail']['tail']['head']
				});
				break;
			}
			case 'l': {
				llaves.push({
					pos_x: ret.X,
					pos_y: ret.Y,
					name: ret.Obj['tail']['head'],
					accesos: ret.Obj['tail']['tail']['head']
				});
				break;
			}
			case 'o': {
				obstaculos.push({
					pos_x: ret.X,
					pos_y: ret.Y,
					name: ret.Obj['tail']['head'],
					altura: ret.Obj['tail']['tail']['head']
				});
				break;
			}
			case 'p': {
				palas.push({
					pos_x: ret.X,
					pos_y: ret.Y,
					name: ret.Obj['tail']['head']
				});
				break;
			}
		}
	}
	query.close();
	return { refugios, obstaculos, llaves, palas };
}

/**
 * Verifica en la en el estado actual tenga una llave
 */
function tengoLlave() {
	let tengo = false;
	tengo = estadoJugador['poseciones']['llaves'].some((llave) => {
		return llave['accesos'] > 0;
	});
	return tengo;
}

/**
 * Verifica en la en el estado actual tenga una llave con accesos
 */
function tengoLlaveConAccesos() {
	let tengo = false;
	tengo = estadoJugador['poseciones']['llaves'].some((llave) => {
		return llave['accesos'] > 0;
	});
	return tengo;
}

/**
 * Obtiene los ID de los elementos HMTL de la grafica a ser actualizados 
 * para los objetos que cambian de posicion (jugador, IA)
 */
function getElementsId(pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion_old, orientacion_new, entidad) {
	let elementsId = { celda: {}, image: {} };
	elementsId['celda']['old'] = 'celda(' + pos_x_i + ',' + pos_y_i + ')';
	elementsId['celda']['new'] = 'celda(' + pos_x_f + ',' + pos_y_f + ')';
	elementsId['image']['old'] = 'celda(' + pos_x_i + ',' + pos_y_i + ')_' + entidad + '_' + orientacion_old;
	elementsId['image']['new'] = 'celda(' + pos_x_f + ',' + pos_y_f + ')_' + entidad + '_' + orientacion_new;
	return elementsId;
}

/**
 * Obtiene los ID de los elementos HMTL de la grafica a ser actualizados 
 * para los objetos que NO cambian de posicion (llaves, palas) -> solo se quitan de la grafica
 */
function getElementsIdObjetos(pos_x, pos_y, objeto) {
	let elementsId = { celda: {}, image: {} };
	elementsId['celda']['old'] = 'celda(' + pos_x + ',' + pos_y + ')';
	elementsId['image']['old'] = 'celda(' + pos_x + ',' + pos_y + ')_' + objeto;
	return elementsId;
}


io.on('connection', function (socket) {
	//query = new swipl.Query('retractall(_)');
	swipl.call('consult("busqueda.pl").');
	console.log('connection established', socket.id);

	socket.on('load_map', ({ estadoInicialJugador, estadoInicialIA }, respuesta) => {
		let mapa = obtenerMapa();
		let valid_j = validarPosicionIncial(estadoInicialJugador.posicion.pos_x, estadoInicialJugador.posicion.pos_y);
		let valid_ia = validarPosicionIncial(estadoInicialIA.posicion.pos_x, estadoInicialIA.posicion.pos_y);
		let objetos = obtenerObjetosEnMapa();
		if (valid_j) {
			estadoJugador = estadoInicialJugador;
		}
		if (valid_ia) {
			estadoIA = estadoInicialIA;
		}
		elementos = {
			refugios: objetos.refugios, obstaculos: objetos.obstaculos,
			llaves: objetos.llaves, palas: objetos.palas
		};
		respuesta({ mapa, valid: { valid_j: valid_j, valid_ia: valid_ia }, objetos });
	});

	socket.on('avanzar_jugador', (respuesta) => {
		let pos_x_f, pos_y_f;
		switch (estadoJugador['orientacion']) {
			case 'N': {
				pos_x_f = estadoJugador['posicion']['pos_x'] - 1;
				pos_y_f = estadoJugador['posicion']['pos_y'];
				break;
			}
			case 'O': {
				pos_x_f = estadoJugador['posicion']['pos_x'];
				pos_y_f = estadoJugador['posicion']['pos_y'] - 1;
				break;
			}
			case 'S': {
				pos_x_f = estadoJugador['posicion']['pos_x'] + 1;
				pos_y_f = estadoJugador['posicion']['pos_y'];
				break;
			}
			case 'E': {
				pos_x_f = estadoJugador['posicion']['pos_x'];
				pos_y_f = estadoJugador['posicion']['pos_y'] + 1;
				break;
			}
		}
		let obstaculo = { hayObstaculo: false, name: null, altura: 0 };
		let refugio = { hayRefugio: false, name: null, reqLlave: null };
		let valid = false, suelo = "", error = 0, msg = "", codigo = 0;
		let elementsId;

		// verifico que la posicion en la que avanza sea válida y no haya lava
		query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo).');
		ret = null;
		if (ret = query.next()) {
			valid = true;
			suelo = ret.Suelo;
		}
		query.close();

		query = new swipl.Query('estaEn([o,Name,Altura],[' + pos_x_f + ',' + pos_y_f + ']).');
		if (ret = query.next()) {
			obstaculo = { hayObstaculo: true, name: ret.Name, altura: ret.Altura };
		}
		query.close();

		query = new swipl.Query('estaEn([r,Name,ReqLlave],[' + pos_x_f + ',' + pos_y_f + ']).');
		if (ret = query.next()) {
			refugio = { hayRefugio: true, name: ret.Name, reqLlave: ret.ReqLlave };
		}
		query.close();

		if (suelo != 'lava') {
			if (valid) {
				if (!obstaculo.hayObstaculo) {
					// si hay refugio 
					if (refugio.hayRefugio) {
						if (refugio.reqLlave == 'si') {
							if (tengoLlave()) {
								if (tengoLlaveConAccesos()) {
									elementsId = getElementsId(estadoJugador['posicion']['pos_x'],
										estadoJugador['posicion']['pos_y'], pos_x_f, pos_y_f, estadoJugador['orientacion'],
										estadoJugador['orientacion'], 'j');
									estadoJugador['posicion']['pos_x'] = pos_x_f;
									estadoJugador['posicion']['pos_y'] = pos_y_f;
									estadoJugador['camino'].push('avanzar(' + pos_x_f + ',' + pos_y_f + ')');
									let index_llave = -1;
									estadoJugador['poseciones']['llaves'].some((llave, index) => {
										if (llave['accesos'] > 0) {
											index_llave = index;
											return index;
										}
									})
									if (index_llave >= 0) {
										estadoJugador['poseciones']['llaves'][index_llave]['accesos'] =
											estadoJugador['poseciones']['llaves'][index_llave]['accesos'] - 1;
									}
									if (suelo == 'firme') {
										estadoJugador['costo'] = estadoJugador['costo'] + 1;
									} else if (suelo == 'resbaladizo') {
										estadoJugador['costo'] = estadoJugador['costo'] + 2;
									}
									codigo = 2;
								} else {
									msg = "ERROR Avanzar: La celda(" + pos_x_f + "," + pos_y_f + ") contiene Refugio y no posee llave con accesos disponibles"
									error = 5;
								}
							} else {
								msg = "ERROR Avanzar: La celda(" + pos_x_f + "," + pos_y_f + ") contiene Refugio y no posee llave"
								error = 4;
							}
						} else { // si el refugio no requiere llave
							elementsId = getElementsId(estadoJugador['posicion']['pos_x'],
								estadoJugador['posicion']['pos_y'], pos_x_f, pos_y_f,
								estadoJugador['orientacion'], estadoJugador['orientacion'], 'j');
							estadoJugador['posicion']['pos_x'] = pos_x_f;
							estadoJugador['posicion']['pos_y'] = pos_y_f;
							estadoJugador['camino'].push('avanzar(' + pos_x_f + ',' + pos_y_f + ')');
							if (suelo == 'firme') {
								estadoJugador['costo'] = estadoJugador['costo'] + 1;
							} else if (suelo == 'resbaladizo') {
								estadoJugador['costo'] = estadoJugador['costo'] + 2;
							}
							codigo = 1;
						}
					} else { // si no hay refugio ni obstaculo actualizo el estado
						elementsId = getElementsId(estadoJugador['posicion']['pos_x'],
							estadoJugador['posicion']['pos_y'], pos_x_f, pos_y_f,
							estadoJugador['orientacion'], estadoJugador['orientacion'], 'j');
						estadoJugador['posicion']['pos_x'] = pos_x_f;
						estadoJugador['posicion']['pos_y'] = pos_y_f;
						estadoJugador['camino'].push('avanzar(' + pos_x_f + ',' + pos_y_f + ')');
						if (suelo == 'firme') {
							estadoJugador['costo'] = estadoJugador['costo'] + 1;
						} else if (suelo == 'resbaladizo') {
							estadoJugador['costo'] = estadoJugador['costo'] + 2;
						}
						codigo = 0;
					}
				} else { //si hay un obstaculo aviso a la grafica del error
					msg = "ERROR Avanzar: La celda(" + pos_x_f + "," + pos_y_f + ") contiene un Obstaculo"
					error = 3;
				}
			} else { // si la posicion no es valida aviso a la grafica del error
				msg = "ERROR Avanzar: La celda(" + pos_x_f + "," + pos_y_f + ") no es válida"
				error = 2;
			}
		} else {
			msg = "ERROR Avanzar: La celda(" + pos_x_f + "," + pos_y_f + ") contiene Lava"
			error = 1;
		}
		respuesta({ error: error, msg: msg, elementsId: elementsId, estado: estadoJugador });
	});

	socket.on('saltar_jugador', (respuesta) => {
		let pos_x_f, pos_y_f, pos_x_i, pos_y_i;
		let actual_x = estadoJugador['posicion']['pos_x'];
		let actual_y = estadoJugador['posicion']['pos_y'];
		switch (estadoJugador['orientacion']) {
			case 'N': {
				pos_x_f = actual_x - 2;
				pos_y_f = actual_y;
				pos_x_i = actual_x - 1;
				pos_y_i = actual_y;
				break;
			}
			case 'O': {
				pos_x_f = actual_x;
				pos_y_f = actual_y - 2;
				pos_x_i = actual_x;
				pos_y_i = actual_y - 1;
				break;
			}
			case 'S': {
				pos_x_f = actual_x + 2;
				pos_y_f = actual_y;
				pos_x_i = actual_x + 1;
				pos_y_i = actual_y;
				break;
			}
			case 'E': {
				pos_x_f = actual_x;
				pos_y_f = actual_y + 2;
				pos_x_i = actual_x;
				pos_y_i = actual_y + 1;
				break;
			}
		}

		let obstaculo_int = { hayObstaculo: false, name: null, altura: 0 };
		let obstaculo_fin = false;
		let refugio_fin = false;
		let elementsId;
		let error = 0, msg = "";
		let suelo_fin = null, suelo_int = null, suelo_ini;

		query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo).');
		ret = null;
		if (ret = query.next()) {
			valid = true;
			suelo_fin = ret.Suelo;
		}
		query.close();
		//me fijo si hay un obstaculo en la posicion intermedia
		elementos.obstaculos.some((obs) => {
			if (obs.pos_x == pos_x_i && obs.pos_y == pos_y_i) {
				obstaculo_int = { hayObstaculo: true, name: obs.name, altura: obs.altura };
				return true;
			}
		});
		//me fijo si hay un obstaculo en la posicion final
		obstaculo_fin = elementos.obstaculos.some((obs) => {
			if (obs.pos_x == pos_x_f && obs.pos_y == pos_y_f) {
				return true;
			}
		});
		//me fijo si hay un refugio en la posicion final
		refugio_fin = elementos.refugios.some((refu) => {
			if (refu.pos_x == pos_x_f && refu.pos_y == pos_y_f) {
				return true;
			}
		});
		//me fijo si hay lava en la posicion intermedia
		query = new swipl.Query('celda([' + pos_x_i + ',' + pos_y_i + '],Suelo).');
		if (ret = query.next()) {
			suelo_int = ret.Suelo;
		}
		query.close();
		//me fijo el tipo de suelo en la posicion de donde sale
		query = new swipl.Query('celda([' + actual_x + ',' + actual_x + '],Suelo).');
		if (ret = query.next()) {
			suelo_ini = ret.Suelo;
		}
		query.close();

		if (suelo_fin != 'lava') {
			if (!refugio_fin) {
				if (!obstaculo_fin) {
					if (obstaculo_int.hayObstaculo) {
						if (obstaculo_int.altura < 5) { // aca puedo realizar el salto
							elementsId = getElementsId(estadoJugador['posicion']['pos_x'],
								estadoJugador['posicion']['pos_y'], pos_x_f, pos_y_f,
								estadoJugador['orientacion'], estadoJugador['orientacion'], 'j');
							estadoJugador['posicion']['pos_x'] = pos_x_f;
							estadoJugador['posicion']['pos_y'] = pos_y_f;
							estadoJugador['camino'].push('saltar_obstaculo(' + pos_x_f + ',' + pos_y_f + ')');
							if (suelo_fin == 'firme') {
								estadoJugador['costo'] = estadoJugador['costo'] + 4;
							} else if (suelo_fin == 'resbaladizo') {
								estadoJugador['costo'] = estadoJugador['costo'] + 5;
							}
						} else {
							msg = "ERROR saltar: celda(" + pos_x_i + "," + pos_y_i + ") Obstaculo Alutura > 5";
							error = 6;
						}
					} else {
						if (suelo_int == 'lava') {
							if (suelo_fin != 'resbaladizo') {
								if (suelo_ini != 'resbaladizo') { // aca puedo realizar el salto
									elementsId = getElementsId(estadoJugador['posicion']['pos_x'],
										estadoJugador['posicion']['pos_y'], pos_x_f, pos_y_f,
										estadoJugador['orientacion'], estadoJugador['orientacion'], 'j');
									estadoJugador['posicion']['pos_x'] = pos_x_f;
									estadoJugador['posicion']['pos_y'] = pos_y_f;
									estadoJugador['camino'].push('saltar_lava(' + pos_x_f + ',' + pos_y_f + ')');
									estadoJugador['costo'] = estadoJugador['costo'] + 3;
								} else {
									msg = "ERROR saltar: celda(" + actual_x + "," + actual_x + ") suelo Resbaladizo";
									error = 6;
								}
							} else {
								msg = "ERROR saltar: celda(" + pos_x_f + "," + pos_y_f + ") suelo Resbaladizo";
								error = 5;
							}
						} else {
							msg = "ERROR saltar: celda(" + pos_x_i + "," + pos_y_i + ") NO contiene Lava ni Obstaculo";
							error = 4;
						}
					}
				} else {
					msg = "ERROR saltar: celda(" + pos_x_f + "," + pos_y_f + ") contiene Obstaculo";
					error = 3;
				}
			} else {
				msg = "ERROR saltar: celda(" + pos_x_f + "," + pos_y_f + ") contiene Refugio";
				error = 2;
			}
		} else {
			msg = "ERROR saltar: celda(" + pos_x_f + "," + pos_y_f + ") contiene Lava";
			error = 1;
		}
		respuesta({ error: error, msg: msg, elementsId: elementsId, estado: estadoJugador });
	});

	socket.on('girar', ({ orientacion }, respuesta) => {
		let elementsId = getElementsId(estadoJugador['posicion']['pos_x'], estadoJugador['posicion']['pos_y'],
			estadoJugador['posicion']['pos_x'], estadoJugador['posicion']['pos_y'],
			estadoJugador['orientacion'], orientacion, 'j');
		switch (orientacion) {
			case 'N': {
				estadoJugador['camino'].push('girar(N)');
				if (estadoJugador['orientacion'] == 'S') {
					estadoJugador['costo'] = estadoJugador['costo'] + 2;
				} else {
					estadoJugador['costo'] = estadoJugador['costo'] + 1;
				}
				break;
			}
			case 'O': {
				estadoJugador['camino'].push('girar(O)');
				if (estadoJugador['orientacion'] == 'E') {
					estadoJugador['costo'] = estadoJugador['costo'] + 2;
				} else {
					estadoJugador['costo'] = estadoJugador['costo'] + 1;
				}
				break;
			}
			case 'S': {
				estadoJugador['camino'].push('girar(S)');
				if (estadoJugador['orientacion'] == 'N') {
					estadoJugador['costo'] = estadoJugador['costo'] + 2;
				} else {
					estadoJugador['costo'] = estadoJugador['costo'] + 1;
				}
				break;
			}
			case 'E': {
				estadoJugador['camino'].push('girar(E)');
				if (estadoJugador['orientacion'] == 'O') {
					estadoJugador['costo'] = estadoJugador['costo'] + 2;
				} else {
					estadoJugador['costo'] = estadoJugador['costo'] + 1;
				}
				break;
			}
		}
		estadoJugador['orientacion'] = orientacion;
		respuesta({ elementsId: elementsId, estado: estadoJugador });
	});

	socket.on('levantar_llave', (respuesta) => {
		let error = 0;
		let msg = "";
		let elementsId = getElementsIdObjetos(estadoJugador['posicion']['pos_x'], estadoJugador['posicion']['pos_y'], 'llave');
		let index_llave = -1;
		let llave_r = null;
		elementos.llaves.some((llave, index) => {
			if (llave.pos_x == estadoJugador['posicion']['pos_x'] && llave.pos_y == estadoJugador['posicion']['pos_y']) {
				index_llave = index;
				llave_r = llave;
				return true;
			}
		});
		if (index_llave >= 0) {
			estadoJugador['camino'].push('levantar_llave(' + estadoJugador['posicion']['pos_x'] + ',' +
				estadoJugador['posicion']['pos_y'] + ')');
			estadoJugador['poseciones']['llaves'].push(elementos.llaves[index_llave]);
			console.log(elementos.llaves[index_llave]);
			let llave_s = '[l,' + llave_r.name + ',' + llave_r.accesos + '],[' + llave_r.pos_x + ',' + llave_r.pos_y + ']';
			query = new swipl.Query('retract(estaEn(' + llave_s + ')).');
			ret = null;
			if (ret = query.next()) {
				console.log("La llave: " + llave_s + " se elimino correctamente");
			}
			query.close();
			elementos['llaves'].splice(index_llave, 1);


			//query = new swipl.Query('retract()');
		} else {
			msg = "ERROR levantar_llave: No existe llave en celda(" + estadoJugador['posicion']['pos_x'] + "," +
				estadoJugador['posicion']['pos_y'] + ")";
			error = 1;
		}

		respuesta({ error: error, msg: msg, elementsId: elementsId, estado: estadoJugador });
	});

	socket.on('levantar_pala', (respuesta) => {
		let error = 0;
		let msg = "";
		let elementsId = getElementsIdObjetos(estadoJugador['posicion']['pos_x'], estadoJugador['posicion']['pos_y'], 'pala');
		let index_pala = -1;
		let pala_r = null;
		elementos.palas.some((pala, index) => {
			if (pala.pos_x == estadoJugador['posicion']['pos_x'] && pala.pos_y == estadoJugador['posicion']['pos_y']) {
				index_pala = index;
				pala_r = pala;
				return true;
			}
		});
		if (index_pala >= 0) {
			estadoJugador['camino'].push('levantar_pala(' + estadoJugador['posicion']['pos_x'] + ',' +
				estadoJugador['posicion']['pos_y'] + ')');
			let pala_s = '[p,' + pala_r.name + '],[' + pala_r.pos_x + ',' + pala_r.pos_y + ']';
			estadoJugador['poseciones']['palas'].push(elementos.palas[index_pala]);
			query = new swipl.Query('retract(estaEn(' + pala_s + ')).');
			ret = null;
			if (ret = query.next()) {
				console.log("La pala: " + pala_s + " se elimino correctamente");
			}
			query.close();
			elementos['palas'].splice(index_pala, 1);
			elementos['palas'].splice(index_pala, 1);
			estadoJugador['costo'] = estadoJugador['costo'] + 1;

		} else {
			msg = "ERROR levantar_pala: No existe pala en celda(" + estadoJugador['posicion']['pos_x'] + "," +
				estadoJugador['posicion']['pos_y'] + ")";
			error = 1;
		}

		respuesta({ error: error, msg: msg, elementsId: elementsId, estado: estadoJugador });
	});

	socket.on('jugar_IA', (respuesta) => {
		//aca va a ir toda la jugada de la IA
		// armar estado incial a partir del estado de la IA
		let poseciones_s = "";
		estadoIA['poseciones']['palas'].forEach((element) => {
			if (poseciones_s == "") {
				poseciones_s = "[p," + element.name + "]";
			} else {// esto no se deberia ejecutar nunca porque no deberia tener poder tener mas de una pala
				poseciones_s += ",[p," + element.name + "]";
			}
		});
		estadoIA['poseciones']['llaves'].forEach((element) => {
			if (poseciones_s == "") {
				poseciones_s = "[l," + element.name + "," + element.accesos + "]";
			} else {
				poseciones_s += ",[l," + element.name + "," + element.accesos + "]";
			}
		});
		poseciones_s = "[" + poseciones_s + "]";

		let estadoInicial = "[[" + estadoIA['posicion']['pos_x'] + "," + estadoIA['posicion']['pos_y'] +
			"]," + estadoIA['orientacion'].toLowerCase() + "," + poseciones_s + "]";
		let metas = "[[4,10]]";
		let elementsId = {};
		let plan = {};
		let destino = {};
		let accion;
		let qry = "buscar_plan(" + estadoInicial + ", " + metas + ", Destino, Plan, Costo).";
		//console.log(qry);
		query = new swipl.Query(qry);
		ret = null;
		if (ret = query.next()) {
			destino = ret.Destino;
			plan = ret.Plan;
		}
		query.close();
		//console.log(plan);
		if(destino.head!='Ganador'){
			let proxima_accion = plan.head;
			//console.log(proxima_accion);
			//console.log(proxima_accion.args);
			//console.log(proxima_accion.args[0].tail);
			if (proxima_accion) {
				if (proxima_accion.name) { // girar, levantar_pala, levantar_llave
					switch (proxima_accion.name) {
						case 'girar': { // en args esta la orientacion a la que quiere girar
							accion = 'girar';
							let orientacion_f = proxima_accion.args[0].toUpperCase();
							let orientacion = estadoIA['orientacion'];
							let pos_x, pos_y;
							pos_x = estadoIA['posicion']['pos_x'];
							pos_y = estadoIA['posicion']['pos_y'];
							elementsId = getElementsId(pos_x, pos_y, pos_x, pos_y, orientacion, orientacion_f, 'ia');
							estadoIA['orientacion'] = orientacion_f;
							estadoIA['camino'].push('girar(' + orientacion_f + ')');
							switch (orientacion) {
								case 'N': {
									if (estadoIA['orientacion'] == 'S') {
										estadoIA['costo'] = estadoIA['costo'] + 2;
									} else {
										estadoIA['costo'] = estadoIA['costo'] + 1;
									}
									break;
								}
								case 'O': {
									if (estadoIA['orientacion'] == 'E') {
										estadoIA['costo'] = estadoIA['costo'] + 2;
									} else {
										estadoIA['costo'] = estadoIA['costo'] + 1;
									}
									break;
								}
								case 'S': {
									if (estadoIA['orientacion'] == 'N') {
										estadoIA['costo'] = estadoIA['costo'] + 2;
									} else {
										estadoIA['costo'] = estadoIA['costo'] + 1;
									}
									break;
								}
								case 'E': {
									if (estadoIA['orientacion'] == 'O') {
										estadoIA['costo'] = estadoIA['costo'] + 2;
									} else {
										estadoIA['costo'] = estadoIA['costo'] + 1;
									}
									break;
								}
							}
							break;
						}
						case 'levantar_pala': { // en args hay un arreglo que tiene la info de la pala
							accion = 'levantar_pala';
							let nombre_pala = proxima_accion.args[0].tail.head;
							let pos_pala = { pos_x: estadoIA['posicion']['pos_x'], pos_y: estadoIA['posicion']['pos_y'] };
							elementsId = getElementsIdObjetos(pos_pala.pos_x, pos_pala.pos_y, 'pala');
							let index_pala = -1;
							let pala_r = null;
							elementos.palas.some((pala, index) => {
								if (pala.pos_x == pos_pala.pos_x && pala.pos_y == pos_pala.pos_y) {
									index_pala = index;
									pala_r = pala;
									return true;
								}
							});
							let pala_s = '[p,' + nombre_pala + '],[' + pala_r.pos_x + ',' + pala_r.pos_y + ']';
							query = new swipl.Query('retract(estaEn(' + pala_s + ')).');
							ret = null;
							if (ret = query.next()) {
								console.log("La pala: " + pala_s + " se elimino correctamente");
							}
							query.close();
							estadoIA['poseciones']['palas'].push(elementos.palas[index_pala]);
							elementos['palas'].splice(index_pala, 1);
							estadoIA['camino'].push('levantar_pala(' + pos_pala.pos_x + ',' + pos_pala.pos_y + ')');
							estadoIA['costo'] = estadoIA['costo'] + 1;
							break;
						}
						case 'levantar_llave': { // en agrs hay un arreglo que tiene la info de la llave
							accion = 'levantar_llave';
							let nombre_llave = proxima_accion.args[0].tail.head;
							let accesos_llave = proxima_accion.args[0].tail.tail.head;
							let pos_llave = { pos_x: estadoIA['posicion']['pos_x'], pos_y: estadoIA['posicion']['pos_y'] };
							elementsId = getElementsIdObjetos(pos_llave.pos_x, pos_llave.pos_y, 'llave');
							let index_llave = -1;
							let llave_r = null;
							elementos.llaves.some((llave, index) => {
								if (llave.pos_x == pos_llave.pos_x && llave.pos_y == pos_llave.pos_y) {
									index_llave = index;
									llave_r = llave;
									return true;
								}
							});
							let llave_s = '[l,' + nombre_llave + ',' + accesos_llave + '],[' + llave_r.pos_x + ',' + llave_r.pos_y + ']';
							query = new swipl.Query('retract(estaEn(' + llave_s + ')).');
							ret = null;
							if (ret = query.next()) {
								console.log("La llave: " + llave_s + " se elimino correctamente");
							}
							query.close();
							estadoIA['poseciones']['llaves'].push(elementos.llaves[index_llave]);
							elementos['llaves'].splice(index_llave, 1);
							estadoIA['camino'].push('levantar_llave(' + pos_llave.pos_x + ',' + pos_llave.pos_y + ')');
							break;
						}
					}
				} else { // avanzar, saltar_lava, saltar_obstaculo
					switch (proxima_accion) {
						case 'avanzar': {
							accion = 'avanzar';
							// obtener los ids y actualizar estado
							let pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, suelo;
							pos_x_i = estadoIA['posicion']['pos_x'];
							pos_y_i = estadoIA['posicion']['pos_y'];
							orientacion = estadoIA['orientacion']
							switch (orientacion) {
								case 'N': {
									pos_x_f = estadoIA['posicion']['pos_x'] - 1;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'O': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] - 1;
									break;
								}
								case 'S': {
									pos_x_f = estadoIA['posicion']['pos_x'] + 1;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'E': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] + 1;
									break;
								}
							}
							elementsId = getElementsId(pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, orientacion, 'ia');
							estadoIA['posicion']['pos_x'] = pos_x_f;
							estadoIA['posicion']['pos_y'] = pos_y_f;
							estadoIA['camino'].push('avanzar(' + pos_x_f + ',' + pos_y_f + ')');
							query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo)');
							ret = null;
							if (ret = query.next()) {
								suelo = ret.Suelo;
							}
							query.close();
							if (suelo == 'firme') {
								estadoIA['costo'] = estadoIA['costo'] + 1;
							} else if (suelo == 'resbaladizo') {
								estadoIA['costo'] = estadoIA['costo'] + 2;
							}
							if (elementos['refugios']['pos_x'] == pos_x_f && elementos['refugios']['pos_y'] == pos_y_f
								&& elementos['refugios']['req_key'] == 'si') {
								// si la posicion a la que avanzo poseia un refugio que requiere llave
								// agarro una llave de las poseciones y le decremento la cantidad de accesos
								let index_llave = -1;
								estadoIA['poseciones']['llaves'].some((llave, index) => {
									if (llave['accesos'] > 0) {
										index_llave = index;
										return true;
									}
								});
								estadoIA['poseciones']['llaves'][index_llave]['accesos'] = estadoIA['poseciones']['llaves'][index_llave]['accesos'] - 1;
							}
							port.write(estadoIA['orientacion']);
							break;
						}
						case 'saltar_lava': {
							accion = 'saltar_lava';
							let pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, suelo;
							pos_x_i = estadoIA['posicion']['pos_x'];
							pos_y_i = estadoIA['posicion']['pos_y'];
							orientacion = estadoIA['orientacion']
							switch (orientacion) {
								case 'N': {
									pos_x_f = estadoIA['posicion']['pos_x'] - 2;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'O': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] - 2;
									break;
								}
								case 'S': {
									pos_x_f = estadoIA['posicion']['pos_x'] + 2;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'E': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] + 2;
									break;
								}
							}
							elementsId = getElementsId(pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, orientacion, 'ia');
							estadoIA['posicion']['pos_x'] = pos_x_f;
							estadoIA['posicion']['pos_y'] = pos_y_f;
							estadoIA['camino'].push('saltar_lava(' + pos_x_f + ',' + pos_y_f + ')');
							estadoIA['costo'] = estadoIA['costo'] + 3;
							port.write(estadoIA['orientacion']);
							port.write(estadoIA['orientacion']);
							break;
						}
						case 'saltar_obstaculo': {
							accion = 'saltar_obstaculo';
							let pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, suelo;
							pos_x_i = estadoIA['posicion']['pos_x'];
							pos_y_i = estadoIA['posicion']['pos_y'];
							orientacion = estadoIA['orientacion']
							switch (orientacion) {
								case 'N': {
									pos_x_f = estadoIA['posicion']['pos_x'] - 2;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'O': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] - 2;
									break;
								}
								case 'S': {
									pos_x_f = estadoIA['posicion']['pos_x'] + 2;
									pos_y_f = estadoIA['posicion']['pos_y'];
									break;
								}
								case 'E': {
									pos_x_f = estadoIA['posicion']['pos_x'];
									pos_y_f = estadoIA['posicion']['pos_y'] + 2;
									break;
								}
							}
							elementsId = getElementsId(pos_x_i, pos_y_i, pos_x_f, pos_y_f, orientacion, orientacion, 'ia');
							estadoIA['posicion']['pos_x'] = pos_x_f;
							estadoIA['posicion']['pos_y'] = pos_y_f;
							estadoIA['camino'].push('saltar_obstaculo(' + pos_x_f + ',' + pos_y_f + ')');
							query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo)');
							ret = null;
							if (ret = query.next()) {
								suelo = ret.Suelo;
							}
							query.close();
							if (suelo == 'firme') {
								estadoIA['costo'] = estadoIA['costo'] + 4;
							} else if (suelo == 'resbaladizo') {
								estadoIA['costo'] = estadoIA['costo'] + 5;
							}
							port.write(estadoIA['orientacion']);
							port.write(estadoIA['orientacion']);
							break;
						}
					}
				}
			} else {
				accion = 'ganador';
				console.log('No es posible hallar un plan');
			}
		} else {
			console.log("Ganador: IA");
		}

		respuesta({ accion: accion, elementsId: elementsId, estado: estadoIA });
	});
});



/* 
const parser = port.pipe(new ReadLine({ delimeter: '\r\n' }));

parser.on('open', function () {
	console.log('connection is opened');
});

parser.on('data', function (data) {
	console.log(data);
	io.emit('lala', data.toString());
});

port.on('error', function (err) {
	console.log(err);
});
 */