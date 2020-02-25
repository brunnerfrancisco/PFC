/*

  Representacion grafica de una isla irregular con 14 filas y 13 columnas:

     1   2   3   4
   _________________
1  | ~ | # | ~ | ~ |
   |___|___|___|___|
2  | ~ | ~ |   | # |                    10  11  12  13
   |___|___|___|___|                   ________________
3  |   | Rn|   | ~ |                   | # | # | # | # | 3
   |___|___|___|___|                   |___|___|___|___|
4  | ~ |   | # |   | 5   6   7   8   9 |   |   |   |   | 4
   |___|___|___|___|___________________|___|___|___|___|
5  |   | P2| ~ |   | Rs| ~ | # | L2| ~ |   |   | # | ~ | 5
   |___|___|___|___|___|___|___|___|___|___|___|___|___|
6  |   |   | O1| ~ | # |   |   | Rs| ~ | # | O2| # | P4| 6
   |___|___|___|___|___|___|___|___|___|___|___|___|___|
7  | # | # | # |   | # | ~ | # | ~ | ~ | Rn|   | Rs| ~ | 7
   |___|___|___|___|___|___|___|___|___|___|___|___|___|
8  | ~ |   | # | P1| ~ | ~ |   | # | # | # | ~ | # | P3| 8
   |___|___|___|___|___|___|___|___|___|___|___|___|___|
9  | ~ | O5| # | ~ |   |   | ~ |   | ~ |   | ~ | # | L1| 9
   |___|___|___|___|___|___|___|___|___|___|___|___|___|
10 |   |   |   | # | ~ |   |   | ~ |
   |___|___|___|___|___|___|___|___|
11 | ~ | # |   | O3|   | ~ |   | O1|
   |___|___|___|___|___|___|___|___|____________
12 | ~ | # | ~ | O8|   |   |   | P5| L3| # | ~ | 12
   |___|___|___|___|___|___|___|___|___|___|___|
13 |   | # | ~ |   |   | # | # | Rs| # | # |   | 13
   |___|___|___|___|___|___|___|___|___|___|___|
14 |   | # | ~ |   | ~ | # | # |   | ~ | # |   | 14
   |___|___|___|___|___|___|___|___|___|___|___|

     1   2   3   4   5   6   7   8   9  10  11


-----------------------------------------------
Referencias de Suelo:

 ____
 |   | : Celda con suelo firme
 |___|

 ____
 | ~ | : Celda con suelo resbaladizo
 |___|

 ____
 | # | : Celda con lava
 |___|


-----------------------------------------------
Referencias de Objetos:

 Rs: Refugio que requiere de llave de acceso

 Rn: Refugio que no requiere de llave de acceso

 Li: Llave que habilita i accesos

 Oi: Obstaculo con altura i

 Pi: Pala i


-----------------------------------------------
IMPORTANTE: Para aquellas celdas que albergan objetos, la grilla dibujada no ilustra el tipo de suelo de la celda 
(debe observarse en la coleccion de hechos definida a continuacion).

*/

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/*
    Configuracion de la isla ilustrada

    Coleccion de Hechos celda/2 y estaEn/2:
*/

%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Celdas de la isla:

celda([1,1], resbaladizo).
celda([1,2], lava).
celda([1,3], resbaladizo).
celda([1,4], resbaladizo).

celda([2,1], resbaladizo).
celda([2,2], resbaladizo).
celda([2,3], firme).
celda([2,4], lava).

celda([3,1], firme).
celda([3,2], resbaladizo).
celda([3,3], firme).
celda([3,4], resbaladizo).
celda([3,10], lava).
celda([3,11], lava).
celda([3,12], lava).
celda([3,13], lava).

celda([4,1], resbaladizo).
celda([4,2], firme).
celda([4,3], lava).
celda([4,4], firme).
celda([4,10], firme).
celda([4,11], firme).
celda([4,12], firme).
celda([4,13], firme).

celda([5,1], firme).
celda([5,2], firme).
celda([5,3], resbaladizo).
celda([5,4], firme).
celda([5,5], firme).
celda([5,6], resbaladizo).
celda([5,7], lava).
celda([5,8], firme).
celda([5,9], resbaladizo).
celda([5,10], firme).
celda([5,11], firme).
celda([5,12], lava).
celda([5,13], resbaladizo).

celda([6,1], firme).
celda([6,2], firme).
celda([6,3], firme).
celda([6,4], resbaladizo).
celda([6,5], lava).
celda([6,6], firme).
celda([6,7], firme).
celda([6,8], firme).
celda([6,9], resbaladizo).
celda([6,10], lava).
celda([6,11], firme).
celda([6,12], lava).
celda([6,13], firme).

celda([7,1], lava).
celda([7,2], lava).
celda([7,3], lava).
celda([7,4], firme).
celda([7,5], lava).
celda([7,6], resbaladizo).
celda([7,7], lava).
celda([7,8], resbaladizo).
celda([7,9], resbaladizo).
celda([7,10], resbaladizo).
celda([7,11], firme).
celda([7,12], firme).
celda([7,13], resbaladizo).

celda([8,1], resbaladizo).
celda([8,2], firme).
celda([8,3], lava).
celda([8,4], firme).
celda([8,5], resbaladizo).
celda([8,6], resbaladizo).
celda([8,7], firme).
celda([8,8], lava).
celda([8,9], lava).
celda([8,10], lava).
celda([8,11], resbaladizo).
celda([8,12], lava).
celda([8,13], resbaladizo).

celda([9,1], resbaladizo).
celda([9,2], resbaladizo).
celda([9,3], lava).
celda([9,4], resbaladizo).
celda([9,5], firme).
celda([9,6], firme).
celda([9,7], resbaladizo).
celda([9,8], firme).
celda([9,9], resbaladizo).
celda([9,10], firme).
celda([9,11], resbaladizo).
celda([9,12], lava).
celda([9,13], firme).

celda([10,1], firme).
celda([10,2], firme).
celda([10,3], firme).
celda([10,4], lava).
celda([10,5], resbaladizo).
celda([10,6], firme).
celda([10,7], firme).
celda([10,8], resbaladizo).

celda([11,1], resbaladizo).
celda([11,2], lava).
celda([11,3], firme).
celda([11,4], resbaladizo).
celda([11,5], firme).
celda([11,6], resbaladizo).
celda([11,7], firme).
celda([11,8], firme).

celda([12,1], resbaladizo).
celda([12,2], lava).
celda([12,3], resbaladizo).
celda([12,4], firme).
celda([12,5], firme).
celda([12,6], firme).
celda([12,7], firme).
celda([12,8], firme).
celda([12,9], firme).
celda([12,10], lava).
celda([12,11], resbaladizo).

celda([13,1], firme).
celda([13,2], lava).
celda([13,3], resbaladizo).
celda([13,4], firme).
celda([13,5], firme).
celda([13,6], lava).
celda([13,7], lava).
celda([13,8], firme).
celda([13,9], lava).
celda([13,10], lava).
celda([13,11], firme).

celda([14,1], firme).
celda([14,2], lava).
celda([14,3], resbaladizo).
celda([14,4], firme).
celda([14,5], resbaladizo).
celda([14,6], lava).
celda([14,7], lava).
celda([14,8], firme).
celda([14,9], resbaladizo).
celda([14,10], lava).
celda([14,11], firme).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Objetos en la isla:

% Refugios:

estaEn([r, r1, no], [3,2]).
estaEn([r, r2, si], [5,5]).
estaEn([r, r3, si], [6,8]).
estaEn([r, r4, no], [7,10]).
estaEn([r, r5, si], [7,12]).
estaEn([r, r6, si], [13,8]).

% Llaves:

estaEn([l, l1, 2], [5,8]).
estaEn([l, l2, 1], [9,13]).
estaEn([l, l3, 3], [12,9]).

% Obstaculos:

estaEn([o, o1, 1], [6,3]).
estaEn([o, o2, 2], [6,11]).
estaEn([o, o3, 5], [9,2]).
estaEn([o, o4, 3], [11,4]).
estaEn([o, o5, 1], [11,8]).
estaEn([o, o6, 8], [12,4]).

% Palas:

estaEn([p, p1], [8,4]).
estaEn([p, p2], [5,2]).
estaEn([p, p3], [8,13]).
estaEn([p, p4], [6,13]).
estaEn([p, p5], [12,8]).

