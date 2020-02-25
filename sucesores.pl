
/*************************************************************************************************************/
/***********************************************   avanzar   *************************************************/
/*************************************************************************************************************/

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es firme
        + no hay refugio en la posicion siguiente
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],avanzar,1):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],avanzar,1):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],avanzar,1):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],avanzar,1):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es resbaladiza
        + no hay refugio en la posicion siguiente
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es firme
        + hay refugio en la posicion siguiente
            + que no requiere llave
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es resbaladiza
        + hay refugio en la posicion siguiente
            + que no requiere llave
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,no],[FilSig,ColSig]).

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es firme
        + hay refugio en la posicion siguiente
            + que requiere llave
            + tiene pala
*/
sucesor([[FilAct,ColAct],n,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],n,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].    
sucesor([[FilAct,ColAct],o,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],o,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].
sucesor([[FilAct,ColAct],s,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],s,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].
sucesor([[FilAct,ColAct],e,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],e,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].
/**/
/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es resbaladiza
        + hay refugio en la posicion siguiente
            + que requiere llave
            + tiene pala
*/
sucesor([[FilAct,ColAct],n,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],n,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].    
sucesor([[FilAct,ColAct],o,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],o,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].
sucesor([[FilAct,ColAct],s,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],s,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].
sucesor([[FilAct,ColAct],e,[[p,NombreP]|RestoLlaves]],[[FilSig,ColSig],e,[[p,NombreP]|RestoLlavesNuevo]],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],RestoLlaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],RestoLlaves,RestoLlavesAux),
    RestoLlavesNuevo = [[l,NombreL,AccesosLNuevo]|RestoLlavesAux].

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es firme
        + hay refugio en la posicion siguiente
            + que requiere llave
            + no tiene pala
*/
sucesor([[FilAct,ColAct],n,Llaves],[[FilSig,ColSig],n,LlavesNuevo],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],o,Llaves],[[FilSig,ColSig],o,LlavesNuevo],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],s,Llaves],[[FilSig,ColSig],s,LlavesNuevo],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],e,Llaves],[[FilSig,ColSig],e,LlavesNuevo],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],firme),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].

/*
    avanzar - condiciones
        + existe la posicion siguiente
        + la posicion siguiente es resbaladiza
        + hay refugio en la posicion siguiente
            + que requiere llave
            + no tiene pala
*/
sucesor([[FilAct,ColAct],n,Llaves],[[FilSig,ColSig],n,LlavesNuevo],avanzar,2):-
    FilSig is FilAct - 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],o,Llaves],[[FilSig,ColSig],o,LlavesNuevo],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct - 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],s,Llaves],[[FilSig,ColSig],s,LlavesNuevo],avanzar,2):-
    FilSig is FilAct + 1,
    ColSig is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].
sucesor([[FilAct,ColAct],e,Llaves],[[FilSig,ColSig],e,LlavesNuevo],avanzar,2):-
    FilSig is FilAct,
    ColSig is ColAct + 1,
    celda([FilSig,ColSig],resbaladizo),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    estaEn([r,_,si],[FilSig,ColSig]),
    member([l,NombreL,AccesosL],Llaves),
    AccesosL > 0,
    AccesosLNuevo is AccesosL - 1,
    eliminar([l,NombreL,AccesosL],Llaves,LlavesAux),
    LlavesNuevo = [[l,NombreL,AccesosLNuevo]|LlavesAux].

/*************************************************************************************************************/
/***********************************************   girar   ***************************************************/
/*************************************************************************************************************/

sucesor([Posicion,n,Posesiones],[Posicion,o,Posesiones],girar(o),1).

sucesor([Posicion,n,Posesiones],[Posicion,s,Posesiones],girar(s),2).

sucesor([Posicion,n,Posesiones],[Posicion,e,Posesiones],girar(e),1).

sucesor([Posicion,o,Posesiones],[Posicion,s,Posesiones],girar(s),1).

sucesor([Posicion,o,Posesiones],[Posicion,e,Posesiones],girar(e),2).

sucesor([Posicion,o,Posesiones],[Posicion,n,Posesiones],girar(n),1).

sucesor([Posicion,s,Posesiones],[Posicion,e,Posesiones],girar(e),1).

sucesor([Posicion,s,Posesiones],[Posicion,n,Posesiones],girar(n),2).

sucesor([Posicion,s,Posesiones],[Posicion,o,Posesiones],girar(o),1).

sucesor([Posicion,e,Posesiones],[Posicion,n,Posesiones],girar(n),1).

sucesor([Posicion,e,Posesiones],[Posicion,o,Posesiones],girar(o),2).

sucesor([Posicion,e,Posesiones],[Posicion,s,Posesiones],girar(s),1).

/*************************************************************************************************************/
/********************************************   saltar_lava   ************************************************/
/*************************************************************************************************************/

sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],saltar_lava,3):-
    FilSig is FilAct - 2,
    ColSig is ColAct,
    FilInt is FilAct - 1,
    ColInt is ColAct,
    celda([FilInt,ColInt],lava),
    celda([FilAct,ColAct],firme),
    celda([FilSig,ColSig],firme),
    \+estaEn([p,_],[FilAct,ColAct]),
    \+estaEn([l,_,_],[FilAct,ColAct]),
    \+estaEn([p,_],[FilSig,ColSig]),
    \+estaEn([l,_,_],[FilSig,ColSig]),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],saltar_lava,3):-
    FilSig is FilAct,
    ColSig is ColAct - 2,
    FilInt is FilAct,
    ColInt is ColAct - 1,
    celda([FilInt,ColInt],lava),
    celda([FilAct,ColAct],firme),
    celda([FilSig,ColSig],firme),
    \+estaEn([p,_],[FilAct,ColAct]),
    \+estaEn([l,_,_],[FilAct,ColAct]),
    \+estaEn([p,_],[FilSig,ColSig]),
    \+estaEn([l,_,_],[FilSig,ColSig]),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],saltar_lava,3):-
    FilSig is FilAct + 2,
    ColSig is ColAct,
    FilInt is FilAct + 1,
    ColInt is ColAct,
    celda([FilInt,ColInt],lava),
    celda([FilAct,ColAct],firme),
    celda([FilSig,ColSig],firme),
    \+estaEn([p,_],[FilAct,ColAct]),
    \+estaEn([l,_,_],[FilAct,ColAct]),
    \+estaEn([p,_],[FilSig,ColSig]),
    \+estaEn([l,_,_],[FilSig,ColSig]),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],saltar_lava,3):-
    FilSig is FilAct,
    ColSig is ColAct + 2,
    FilInt is FilAct,
    ColInt is ColAct + 1,
    celda([FilInt,ColInt],lava),
    celda([FilAct,ColAct],firme),
    celda([FilSig,ColSig],firme),
    \+estaEn([p,_],[FilAct,ColAct]),
    \+estaEn([l,_,_],[FilAct,ColAct]),
    \+estaEn([p,_],[FilSig,ColSig]),
    \+estaEn([l,_,_],[FilSig,ColSig]),
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).

/*************************************************************************************************************/
/******************************************   saltar_obstaculo   *********************************************/
/*************************************************************************************************************/

/*
    saltar_obstaculo con suelo destino firme
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],saltar_obstaculo,4):-
    FilSig is FilAct - 2,
    ColSig is ColAct,
    FilInt is FilAct - 1,
    ColInt is ColAct,
    celda([FilSig,ColSig],firme),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],saltar_obstaculo,4):-
    FilSig is FilAct,
    ColSig is ColAct - 2,
    FilInt is FilAct,
    ColInt is ColAct - 1,
    celda([FilSig,ColSig],firme),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],saltar_obstaculo,4):-
    FilSig is FilAct + 2,
    ColSig is ColAct,
    FilInt is FilAct + 1,
    ColInt is ColAct,
    celda([FilSig,ColSig],firme),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],saltar_obstaculo,4):-
    FilSig is FilAct,
    ColSig is ColAct + 2,
    FilInt is FilAct,
    ColInt is ColAct + 1,
    celda([FilSig,ColSig],firme),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).

/*
    saltar_obstaculo con suelo destino resbaladizo
*/
sucesor([[FilAct,ColAct],n,Posesiones],[[FilSig,ColSig],n,Posesiones],saltar_obstaculo,5):-
    FilSig is FilAct - 2,
    ColSig is ColAct,
    FilInt is FilAct - 1,
    ColInt is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],o,Posesiones],[[FilSig,ColSig],o,Posesiones],saltar_obstaculo,5):-
    FilSig is FilAct,
    ColSig is ColAct - 2,
    FilInt is FilAct,
    ColInt is ColAct - 1,
    celda([FilSig,ColSig],resbaladizo),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],s,Posesiones],[[FilSig,ColSig],s,Posesiones],saltar_obstaculo,5):-
    FilSig is FilAct + 2,
    ColSig is ColAct,
    FilInt is FilAct + 1,
    ColInt is ColAct,
    celda([FilSig,ColSig],resbaladizo),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).
sucesor([[FilAct,ColAct],e,Posesiones],[[FilSig,ColSig],e,Posesiones],saltar_obstaculo,5):-
    FilSig is FilAct,
    ColSig is ColAct + 2,
    FilInt is FilAct,
    ColInt is ColAct + 1,
    celda([FilSig,ColSig],resbaladizo),
    estaEn([o,_,AlturaO],[FilInt,ColInt]),
    AlturaO < 5,
    \+estaEn([o,_,_],[FilSig,ColSig]),
    \+estaEn([r,_,_],[FilSig,ColSig]).


/*************************************************************************************************************/
/******************************************   levantar_llave   ***********************************************/
/*************************************************************************************************************/

/*
    levantar_llave con pala
*/
sucesor([Posicion,Dir,[[p,NombreP]|Posesiones]],[Posicion,Dir,[[p,NombreP],[l,NombreL,Accesos]|Posesiones]],
    levantar_llave([l,NombreL,Accesos]),0):-
    estaEn([l,NombreL,Accesos],Posicion),
    not(member([l,NombreL,_],Posesiones)).

/*
    levantar_llave sin pala
*/
sucesor([Posicion,Dir,Posesiones],[Posicion,Dir,[[l,NombreL,Accesos]|Posesiones]],
    levantar_llave([l,NombreL,Accesos]),0):-
    estaEn([l,NombreL,Accesos],Posicion),
    not(member([l,NombreL,_],Posesiones)).


/*************************************************************************************************************/
/******************************************   levantar_pala   ************************************************/
/*************************************************************************************************************/

/*
    levantar_pala
*/
sucesor([Posicion,Dir,Posesiones],[Posicion,Dir,[[p,NombrePala]|Posesiones]],levantar_pala([p,NombrePala]),1):-
    estaEn([p,NombrePala],Posicion),
    not(member([p,_],Posesiones)).