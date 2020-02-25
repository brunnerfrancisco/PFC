const swipl = require('swipl');

swipl.call('consult("busqueda.pl")');
const query = new swipl.Query('buscar_plan([[7,13],s,[]], [[7,4], [7,11]], Destino, Plan, Costo).');
let ret = null;
while (ret = query.next()) {
    console.log('Destino: ',ret.Destino);
    console.log('Plan: ',ret.Plan);
    console.log('Costo: ',ret.Costo);
}