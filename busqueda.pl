:-consult('sucesores.pl').
%:-consult('islaExample.pl').
%:-consult('mapa.pl').
/*
    Se definen los predicados dinamicos a ser utilizados
*/
:-dynamic frontera/1, visitado/1, tupla/3, meta/1, estaEn/2.
:-consult('mapa.pl').
/*
    flag para que a la hora de hacer las consultas por la consola
        muestre TODOS los elementos de las listas
*/
:-set_prolog_flag(answer_write_options,[max_depth(0)]).

/*************************************************************************************************************/

/*
    buscar_plan(+EstadoInicial,+Metas,-Destino,-Plan,-Costo)
        Busca una secuencia de acciones tal que aplicados al estado inicial,
        llega a un estado donde la posicion es una meta (Destino) 
        y el costo asociado a esa secuencia de operadores
        La busqueda se realiza aplicando el metodo A*
*/
buscar_plan(EstadoInicial,Metas,Destino,_Plan,_Costo):-
    retractall(frontera(_)),
    retractall(visitado(_)),
    retractall(tupla(_,_,_)),
    retractall(meta(_)),
    EstadoInicial = [PosIni,_,[[p,_]]],
    member(PosIni,Metas),!,
    nl,write('Ganador'),nl,
    Destino ='Ganador'.
buscar_plan(EstadoInicial,Metas,Destino,Plan,Costo):-
    retractall(frontera(_)),
    retractall(visitado(_)),
    retractall(tupla(_,_,_)),
    retractall(meta(_)),
    agregarTuplasPalaMeta(Metas),
    buscarHeuristica(EstadoInicial,Heuristica),
    assert(frontera(nodo(EstadoInicial,[],0,Heuristica))),
    buscarAE(Destino,Plan,Costo),!.
buscar_plan(_,_,_,_,_):-
    nl,write('No es posible hallar un plan'),nl,
    fail.

/*
    buscarAE(Destino,Solucion,Costo)
        Este predicado implementa el metodo de busqueda A*
            Considerciones:
                Tanto la Frontera como el control de visitados se manipulan
                utilizando predicados dinámicos.
            Caso Base:
                Se Selecciona un nodo de la frontera
                El nodo seleccionado corresponde a un Estado Meta
                Destino <- Posicion del Estado Meta
                Solucion <- Lista de acciones asociado al camino de la busqueda 
                    desde el Estado Inicial hasta el Estado Meta
                Costo <- Costo asociado al camino luego de aplicar el camino de acciones
            Caso Recursivo:
                Se selecciona un nodo de la frontera
                El Nodo seleccionado NO corresponde a un Estado Meta
                Se generan los Potenciales Vecinos del Estado asociado al Nodo
                Se agregan los Potenciales Vecinos a la Frontera haciendo el control de visitados.
*/
buscarAE(Destino,Solucion,Costo):-
    seleccionar(nodo(Estado,Camino,Costo,_)),
    esMeta(Estado),!,
    Estado=[Destino,_,_],
    reverse(Camino,Solucion).
buscarAE(Destino,Solucion,Costo):-
    seleccionar(Nodo),
    assertz(visitado(Nodo)),
    retract(frontera(Nodo)),
    generarVecinos(Nodo,Vecinos),
    agregar(Vecinos),
    buscarAE(Destino,Solucion,Costo).

/*
    seleccionar(Nodo):
        selecciona un nodo de la frontera, es decir busca el Nodo cuya F(Nodo) sea menor
        entre los hechos dinamicos correspondientes a la frontera
*/
seleccionar(nodo(Estado,Camino,Costo,Fn)):-
    buscarMenorNodoEnFrontera(nodo(Estado,Camino,Costo,Fn)),!.

/*
    buscarMenorNodoEnFrontera(-Nodo):
        se encarga de buscar en la frontera el Nodo cuya F sea menor de todos
*/
buscarMenorNodoEnFrontera(nodo(E,L,C,MenorF)):-
    frontera(nodo(E,L,C,MenorF)),
    not((
        frontera(nodo(_OtraE,_OtraL,_OtraC,OtraF)),
        MenorF > OtraF
    )),!.

/*
    agregar(ListaDeVecinos)
        agrega los Nodos de ListaDeVecinos al final de la frontera
        (con assertz(frontera(Nodo)) agrega los hechos como ultimos hechos del programa)
        Control De Visitados:
            Para cada NodoVecino en ListaDeVecinos
                - Si existe un NodoFrontera cuyo EstadoNF ya esta en la frontera: 
                    + si tiene un costo peor -> lo reemplazo
                    + si no tiene un costo peor -> lo descarto
                - Si ya esta visitado: 
                    + si tiene un costo peor -> lo saco de visitados y pongo el nuevo en la frontera
                    + si no tiene un costo peor -> lo descarto
                - En otro caso se agrega NodoVecino a la frontera como un nodo nuevo
*/
agregar([]):-!.
agregar([nodo(E,L,C,F)|RestoVecinos]):-
    frontera(nodo(E,L1,C1,F1)),
    C<C1,!,
    retract(frontera(nodo(E,L1,C1,F1))),
    assertz(frontera(nodo(E,L,C,F))),
    agregar(RestoVecinos).
agregar([nodo(E,L,C,F)|RestoVecinos]):-
    visitado(nodo(E,L1,C1,F1)),
    C<C1,!,
    retract(visitado(nodo(E,L1,C1,F1))),
    assertz(frontera(nodo(E,L,C,F))),
    agregar(RestoVecinos).
agregar([nodo(E,_,C,_)|RestoVecinos]):-
    frontera(nodo(E,_,C1,_)),
    C>=C1,!,
    agregar(RestoVecinos).
agregar([nodo(E,_,C,_)|RestoVecinos]):-
    visitado(nodo(E,_,C1,_)),
    C>=C1,!,
    agregar(RestoVecinos).
agregar([nodo(E,L,C,F)|RestoVecinos]):-
    assertz(frontera(nodo(E,L,C,F))),
    agregar(RestoVecinos).

/*
    generarVecinos(nodo(Estado,Camino,Costo),Vecinos)
        Dado un Nodo:
            - genera todos aquellos vecinos potenciales que sean sucesores del Estado 
            - calcula el costo del nuevo nodo
            - calcula la heuristica para el nuevo Estado
            - calcula la F = Costo + Heuristica para el nuevo Estado
*/
generarVecinos(nodo(EstadoActual,Camino,CostoViejo,_Fn),Vecinos):-
    findall(
        nodo(EstadoNuevo,[Operador|Camino],CostoNuevo,FNueva), 
        (
            sucesor(EstadoActual,EstadoNuevo,Operador,CostoActual),
            CostoNuevo is CostoActual + CostoViejo, 
            buscarHeuristica(EstadoNuevo,HeuristicaNueva), 
            FNueva is CostoNuevo + HeuristicaNueva
        ), 
        Vecinos).

/*
    esMeta(+Estado) 
        comprueba que Estado sea una meta
*/
esMeta([[Fila,Columna],_,[[p,_]|_]]):-meta([Fila,Columna]).

/*      ACA TERMINAN LOS PREDICADOS CORRESPONDIESTES AL ESQUELETO DEL A*     */
/*************************************************************************************************************/

/*
    agregarTuplasPalaMeta(Metas).
        Se agregan las Metas como hechos dinámicos 
            (haciendo un chequeo previo para saber si no correponden a celdas prohibidas)
        Se realiza un producto cartesiano entre palas y metas y se les asocia la distancia entre cada par
        Por último se agregar las Tuplas como hechos dinámicos
*/
agregarTuplasPalaMeta(Metas):-
    agregarMetas(Metas),
    findall(
        tupla([FilaPala,ColumnaPala],[FilaMeta,ColumnaMeta],Distancia),
        (
            estaEn([p,_],[FilaPala,ColumnaPala]),
            meta([FilaMeta,ColumnaMeta]),
            Distancia is abs(FilaPala - FilaMeta) + abs(ColumnaPala - ColumnaMeta)
        ),
        Tuplas),
    agregarTuplas(Tuplas).

/*
    agregarMetas(+ListaDeMetas).
        Agrega como hechos dinámicos las metas de la ListaDeMetas aquellas metas que sean alcanzables
        es decir que sea una posicion valida de la isla, que no haya lava y que no haya obstaculos
*/
agregarMetas([]):-!.
agregarMetas([Meta|RestoMetas]):-
    celda(Meta,firme),
    \+estaEn([o,_,_],Meta),!,
    assertz(meta(Meta)),
    agregarMetas(RestoMetas).
agregarMetas([Meta|RestoMetas]):-
    celda(Meta,resbaladizo),
    \+estaEn([o,_,_],Meta),!,
    assertz(meta(Meta)),
    agregarMetas(RestoMetas).
agregarMetas([_|RestoMetas]):-
    agregarMetas(RestoMetas).

/*
    agregarTuplas(+ListaDeTuplas).
        Agrega como hechos dinamicos las tuplas de la ListaDeTuplas
*/
agregarTuplas([]):-!.
agregarTuplas([Tupla|RestoTuplas]):-
    assertz(Tupla),
    agregarTuplas(RestoTuplas).

/*
    buscarHeuristica(+Estado,-Heuristica).
        Para el calculo de la heuristica se diferencia el caso en que el estado posea una pala
            y el caso en que no posea la pala
        En caso de tener la pala:
            Retorna en Heuristica la menor distancia a una meta.
        En caso de no tener la pala:
            Retorna en Heuristica la menor distancia a una pala cuya distancia a una meta sea la menor.
*/
buscarHeuristica([[Fila,Columna],_,[[p,_]|_]],Heuristica):-!,
    buscarMenorMeta([Fila,Columna],Heuristica).
buscarHeuristica([[Fila,Columna],_,_],Heuristica):-
    buscarMenorMetaPala([Fila,Columna],Heuristica).
buscarMenorMeta([Fila,Columna],MenorHeuristica):-
    meta([FilaMeta,ColumnaMeta]),
    MenorHeuristica is abs(Fila - FilaMeta) + abs(Columna - ColumnaMeta),
    not((
        meta([FilMetaOtra,ColMetaOtra]),
        HeuristicaOtra is abs(Fila - FilMetaOtra) + abs(Columna - ColMetaOtra),
        MenorHeuristica > HeuristicaOtra
    )),!.
buscarMenorMetaPala([Fila,Columna],MenorHeuristica):-
    tupla([FilPala,ColPala],[_FilMeta,_ColMeta],DistanciaPalaMeta),
    MenorHeuristica is abs(Fila - FilPala) + abs(Columna - ColPala) + DistanciaPalaMeta,
    not((
        tupla([FilPalaOtra,ColPalaOtra],[_FilMetaOtra,_ColMetaOtra],DistanciaOtra),
        HeuristicaOtra is abs(Fila - FilPalaOtra) + abs(Columna - ColPalaOtra) + DistanciaOtra,
        MenorHeuristica > HeuristicaOtra
    )),!.

/*
    eliminar(LLave,+ListaPosesiones,-NuevaListaPosesiones).
        Elimina la LLave de la Lista de Posesiones y
        en NuevaListaPosesiones se devuelve ListaPosesiones sin la LLave
*/
eliminar([l,_,_],[],[]):-!.
eliminar([l,NombreLlave,Accesos],[[l,NombreLlave,Accesos]|Resto],Resto):-!.
eliminar([l,NombreLlave,Accesos],[[l,NombreLlave2,Accesos2]|Resto],RestoAux):-
    NombreLlave\=NombreLlave2,
    Accesos\=Accesos2,
    eliminar([l,NombreLlave,Accesos],Resto,RestoAux).