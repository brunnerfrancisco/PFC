const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const swipl = require('swipl');
const SerialPort = require('serialport');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);
const ReadLine = SerialPort.parsers.Readline;

swipl.call('consult("busqueda.pl")');

app.set('port', process.env.PORT || 1100);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
	console.log('server listening on port', app.get('port'));
});

function obtenerPosiciones() {
let query = new swipl.Query('celda(Pos,Suelo).');
		let ret = null;
		let positions = {};
		let maxX = 1, maxY = 1;
		while (ret = query.next()) {
			positions['celda(' + ret.Pos['head'] + ',' + ret.Pos['tail']['head'] + ')'] = {
				pos_x: ret.Pos['head'],
				pos_y: ret.Pos['tail']['head'],
				suelo: ret.Suelo
			}
			// obtengo los maximos de filas y columnas
			if (ret.Pos['head'] > maxX) {
				maxX = ret.Pos['head'];
			}
			if (ret.Pos['tail']['head'] > maxY) {
				maxY = ret.Pos['tail']['head'];
			}
		}
		query.close();
	return { positions, maxX, maxY };
}

function obtenerObjetosEnMapa() {
	let query = new swipl.Query('estaEn(Obj,Pos)');
	let ret = null;
	let refugio = 0, llave = 0, obstaculo = 0, pala = 0;
	let refugios = [], obstaculos = [], llaves = [], palas = [];
	while (ret = query.next()) {
		switch (ret.Obj['head']) {
			case 'r': {
				refugios[refugio] = {
					pos_x: ret.Pos['head'],
					pos_y: ret.Pos['tail']['head'],
					name: ret.Obj['tail']['head'],
					req_key: ret.Obj['tail']['tail']['head']
				}
				refugio++;
				break;
			}
			case 'l': {
				llaves[llave] = {
					pos_x: ret.Pos['head'],
					pos_y: ret.Pos['tail']['head'],
					name: ret.Obj['tail']['head'],
					accesos: ret.Obj['tail']['tail']['head']
				}
				llave++;
				break;
			}
			case 'o': {
				obstaculos[obstaculo] = {
					pos_x: ret.Pos['head'],
					pos_y: ret.Pos['tail']['head'],
					name: ret.Obj['tail']['head'],
					altura: ret.Obj['tail']['tail']['head']
				}
				obstaculo++;
				break;
			}
			case 'p': {
				palas[pala] = {
					pos_x: ret.Pos['head'],
					pos_y: ret.Pos['tail']['head'],
					name: ret.Obj['tail']['head']
				}
				pala++;
				break;
			}
		}
	}
	query.close();
	return { refugios, obstaculos, llaves, palas };
}

io.on('connection', function (socket) {
	console.log('connection established', socket.id);

	socket.on('cargar_mapa', ( {pos_x_ei, pos_y_ei}, respuesta) => {
		let query = new swipl.Query('celda(Pos,Suelo).');
		let ret = null;
		let positions = {};
		let maxX = 1, maxY = 1;
		while (ret = query.next()) {
			positions['celda(' + ret.Pos['head'] + ',' + ret.Pos['tail']['head'] + ')'] = {
				pos_x: ret.Pos['head'],
				pos_y: ret.Pos['tail']['head'],
				suelo: ret.Suelo
			}
			// obtengo los maximos de filas y columnas
			if (ret.Pos['head'] > maxX) {
				maxX = ret.Pos['head'];
			}
			if (ret.Pos['tail']['head'] > maxY) {
				maxY = ret.Pos['tail']['head'];
			}
		}
		query.close();
		let valid = false;
		query = new swipl.Query('celda(['+pos_x_ei+','+pos_y_ei+'],Suelo).');
		ret = null;
		if(ret = query.next()) {
			valid = true;
		}
		query.close();
		let max_X_Y = { max_x: maxX, max_y: maxY };
		let positions_x_y = { positions, max_X_Y };
		//let positions = obtenerPosiciones();
		let objetos = obtenerObjetosEnMapa();
		respuesta({ positions_x_y, valid:valid, objetos });
	});

	socket.on('check_avanzar', ({ pos_x_f, pos_y_f }, respuesta) => {
		let query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo).');
		let ret = null, valid = false, suelo = null;
		let obstaculo = { hayObstaculo: false, name: null, altura: 0 };
		let refugio = { hayRefugio: false, name: null, ReqLlave: null };
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
		respuesta({ valid: valid, suelo: suelo, obstaculo: obstaculo, refugio: refugio });
	});

	socket.on('check_saltar', ({ pos_x_f, pos_y_f, pos_x_i, pos_y_i }, respuesta) => {
		let query = new swipl.Query('celda([' + pos_x_f + ',' + pos_y_f + '],Suelo).');
		let ret = null, valid = false, suelo = null;
		let obstaculo = { hayObstaculo: false, name: null, altura: 0 };
		let lava = false;
		if (ret = query.next()) {
			valid = true;
			suelo = ret.Suelo;
		}
		query.close();
		//me fijo si hay un obstaculo en la posicion intermedia
		query = new swipl.Query('estaEn([o,Name,Altura],[' + pos_x_i + ',' + pos_y_i + ']).');
		if (ret = query.next()) {
			obstaculo = { hayObstaculo: true, name: ret.Name, altura: ret.Altura };
		}
		query.close();
		//me fijo si hay lava en la posicion intermedia
		query = new swipl.Query('celda([' + pos_x_i + ',' + pos_y_i + '],Suelo).');
		if (ret = query.next()) {
			lava = ret.Suelo=='lava';
		}
		query.close();
		respuesta({valid: valid, suelo: suelo, obstaculo: obstaculo, lava:lava});
	});
});

/*
// en linux /dev/tty(algo)
const port = new SerialPort('COM5',{
    baudRate: 9600
});

const parser = port.pipe(new ReadLine({ delimeter: '\r\n' }));

parser.on('open', function(){
    console.log('connection is opened');
});

parser.on('data', function(data){
	console.log(data);
	io.emit('lala', data.toString());
});

port.on('error', function(err){
	console.log(err);
});
 */