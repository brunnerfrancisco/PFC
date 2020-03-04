/*

  Representacion grafica de una isla irregular con 3 filas y 10 columnas:

     1   2   3   4   5   6   7   8   9  10
   _________________________________________
1  |   |   |   |   | # | L2| # |   | O4| P1|
   |___|___|___|___|___|___|___|___|___|___|
2  |   | # | # |   | # | ~ | # | ~ | O3|   |
   |___|___|___|___|___|___|___|___|___|___|
3  |   |   | # |   |   |   | Rs|   | O2| ~ |
   |___|___|___|___|___|___|___|___|___|___|
4  |   |   | # | ~ |   |   | Rn|   | O1|   |
   |___|___|___|___|___|___|___|___|___|___|

     1   2   3   4   5   6   7   8   9  10 


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
*/

celda([1,1],firme).
celda([1,2],firme).
celda([1,3],firme).
celda([1,4],firme).
celda([1,5],lava).
celda([1,6],firme).
celda([1,7],lava).
celda([1,8],firme).
celda([1,9],firme).
celda([1,10],firme).

celda([2,1],firme).
celda([2,2],lava).
celda([2,3],lava).
celda([2,4],firme).
celda([2,5],lava).
celda([2,6],resbaladizo).
celda([2,7],lava).
celda([2,8],resbaladizo).
celda([2,9],firme).
celda([2,10],firme).

celda([3,1],firme).
celda([3,2],firme).
celda([3,3],lava).
celda([3,4],resbaladizo).
celda([3,5],firme).
celda([3,6],firme).
celda([3,7],firme).
celda([3,8],firme).
celda([3,9],firme).
celda([3,10],resbaladizo).

celda([4,1],firme).
celda([4,2],firme).
celda([4,3],lava).
celda([4,4],resbaladizo).
celda([4,5],firme).
celda([4,6],firme).
celda([4,7],firme).
celda([4,8],firme).
celda([4,9],firme).
celda([4,10],firme).

estaEn([l,l1,2],[1,6]).
estaEn([l,l2,1],[2,6]).
estaEn([r,r1,si],[3,7]).
estaEn([r,r2,si],[4,7]).
estaEn([o,o1,1],[1,9]).
estaEn([o,o2,2],[2,9]).
estaEn([o,o3,3],[3,9]).
estaEn([o,o4,4],[4,9]).
estaEn([p,p1],[1,10]).