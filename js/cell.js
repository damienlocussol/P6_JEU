function Cell(id, size, left, top, isPlayer, isWeapon, isHighLight){	//Objet cellule

	this.id = id;
	this.size = size;										//taille en px
	this.left = left;										//position left
	this.top = top;											//position top
	this.isPlayer = isPlayer;								//libre ou occupé par un personnage
	this.isWeapon = isWeapon;								//libre ou occupé par une arme
	this.isAccess = Math.random() < 0.9 ? true : false ;	//obstacle
	this.isHighLight = isHighLight;							//deplacement possible;

}

