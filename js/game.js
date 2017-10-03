function Game (nb, size, speed) {	//Objet principal du jeu      arg nb	  nb de lignes et colonnes	
																//arg size	  taille en px d'une cellule	
																//arg speed   vitesse de déplacement des éléments

	this.board = new Board(nb, size);		//instance de board

	this.weapons = [ new Weapon(0, 'REDcouteau', 20, 'red'),		//tableau contenant les instances de l'objet arme présent sur le plateau
					 new Weapon(1, 'BLUErevolver', 30, 'blue'), 
					 new Weapon(2, 'GREENmitraillette', 40, 'green'), 
					 new Weapon(3, 'PINKlance-roquette', 50, 'pink')];

	this.players = [];												//tableau vide qui contiendra les instances de l'objet joueur défini par l'utilisateur

	this.continu = true;											//prop pour continuer la boucle principale du jeu

	this.speed = speed;									

	this.getDeplacement = function(currentPlayer){					//méthode déplacements possible en haut à gauche à droite à gauche
																	//si les cellules sont sans obstacles et sans joueur
																	//pour un maximum de 3 cases, sinon on sort de la boucle

		var cur = currentPlayer.pos;

		//DROITE
		for(var i = 1; i <= 3; i++){

			if( cur.x+i >=0 && 
				cur.x+i < this.board.cells.length &&
				this.board.cells[cur.x+i][cur.y].isAccess === true &&
				this.board.cells[cur.x+i][cur.y].isPlayer === null){
					this.board.cells[cur.x+i][cur.y].isHighLight = true;
			}else{
				break;
			}
		}

		//GAUCHE
		for(var i = -1; i >= -3; i--){

			if( cur.x+i >=0 && 
				cur.x+i < this.board.cells.length &&
				this.board.cells[cur.x+i][cur.y].isAccess === true
				&& this.board.cells[cur.x+i][cur.y].isPlayer === null){
					this.board.cells[cur.x+i][cur.y].isHighLight = true;
			}else{
				break;
			}
		}

		//BAS
		for(var i = 1; i <= 3; i++){

			if( cur.y+i >=0 && 
				cur.y+i < this.board.cells.length &&
				this.board.cells[cur.x][cur.y+i].isAccess === true &&
				this.board.cells[cur.x][cur.y+i].isPlayer === null){
					this.board.cells[cur.x][cur.y+i].isHighLight = true;
			}else{
				break;
			}
		}

		//HAUT
		for(var i = -1; i >= -3; i--){

			if( cur.y+i >=0 && 
				cur.y+i < this.board.cells.length &&
				this.board.cells[cur.x][cur.y+i].isAccess === true &&
				this.board.cells[cur.x][cur.y+i].isPlayer === null){
					this.board.cells[cur.x][cur.y+i].isHighLight = true;
			}else{
				break;
			}
		}

		displayCellsOptions(this.board);							//affichage des déplacements possibles

		displayHighLight(currentPlayer.id, true);					//coloration des infos du joueur en cours

		var that = this;	//changement de contexte

		$('.highLight').on('click', function(e){					//event onclick sur une cellule disponible pour un déplacement			
			$('.highLight').off('click').removeClass('highLight');	//suppression de la coloration des cellules

			for(var i = 0; i < that.board.cells.length; i++){
				for(var j = 0; j < that.board.cells[i].length; j++){
					that.board.cells[i][j].isHighLight = false;		//board.isHighLigh à nouveau libre
				}
			}

			var pos = e.target.id.split('-');						//tableau contenant l'id de la cellule selectionné par le joueur

			that.Deplacement(currentPlayer, pos);					//action du déplacement
			
		});

	};

	this.Deplacement = function(currentPlayer, pos){				//méthode qui gère le déplacement du joueur	
																	//vérifie sur chaque cellule de la position de départ du joueur à sa position d'arrivée 

		var cur = currentPlayer.pos;
		var countCell = 0;											//variable qui compte le nombre de cellule

		if(pos[0] - cur.x > 0){	//droite
			for(var i = cur.x+1 ; i <= pos[0] ; i++){
				currentPlayer.playerMove(i, cur.y, this.board, this.speed, this.weapons);	//déplacement du joueur
				countCell+=1;
				if(i === parseInt(pos[0])){													//une fois arrivé sur la position finale
					this.IsTherePlayer(currentPlayer, i , cur.y, this.board.cells.length);	//appel de la méthode isTherePlayer
				}
			}
		}
		else if(pos[0] - cur.x < 0){	//gauche
			for(var i = cur.x-1 ; i >= pos[0] ; i--){
				currentPlayer.playerMove(i, cur.y, this.board, this.speed, this.weapons);
				countCell+=1;
				if(i === parseInt(pos[0])){
					this.IsTherePlayer(currentPlayer, i, cur.y, this.board.cells.length);
				}
			}
		}
		else if(pos[1] - cur.y > 0){	//bas
			for(var i = cur.y+1 ; i <= pos[1] ; i++){
				currentPlayer.playerMove(cur.x , i, this.board, this.speed, this.weapons);
				countCell+=1;
				if(i === parseInt(pos[1])){
					this.IsTherePlayer(currentPlayer, cur.x , i, this.board.cells.length);
				}
			}
		}
		else if(pos[1] - cur.y < 0){	//haut
			for(var i = cur.y-1 ; i >= pos[1] ; i--){
				currentPlayer.playerMove(cur.x , i, this.board, this.speed, this.weapons);
				countCell+=1;
				if(i === parseInt(pos[1])){
					this.IsTherePlayer(currentPlayer, cur.x , i, this.board.cells.length);
				}
			}
		}

		displayHighLight(currentPlayer.id, false);		//décoloration des infos du joueur en cours

		var that = this;								//changement de contexte avec setTimeout

		if(this.continu === true){  					//joueur suivant - reprend la boucle avec this.getNextPlayer appelé depuis player.fight à la fin d'un combat
			setTimeout(function(){						//délai pour que le joueur finisse son action en cours
				that.getNextPlayer(currentPlayer);
			}, countCell*this.speed);
		}

	};

	this.IsTherePlayer = function(currentPlayer, xx, yy, len){		//méthode qui vérifie la présence d'un joueur sur les cellules adjacentes

		if(xx+1 < len){		//vérification des cases du plateau  si < len ->en dehors du plateau
			if(this.board.cells[xx+1][yy].isPlayer != null){		//si un joueur est bien présent -> fight
				var playerAttack = currentPlayer;			
				var playerDefense = this.players[this.board.cells[xx+1][yy].isPlayer];
				if(playerDefense.endFight === false){
					var next = this;
					playerAttack.fight(playerAttack, playerDefense, next, currentPlayer);	//appel de la méthode fight -> on rentre dans la boucle combat du jeu
					this.continu = false;													//fin de la boucle dans this.déplacement -> combat en cours
				}
			}
		}

		if(xx-1 >= 0){
			if(this.board.cells[xx-1][yy].isPlayer != null){
				var playerAttack = currentPlayer;
				var playerDefense = this.players[this.board.cells[xx-1][yy].isPlayer];
				if(playerDefense.endFight === false){
					var next = this;
					playerAttack.fight(playerAttack, playerDefense, next, currentPlayer);
					this.continu = false;
				}
			}
		}

		if(yy+1 < len){
			if(this.board.cells[xx][yy+1].isPlayer != null){
				var playerAttack = currentPlayer;
				var playerDefense = this.players[this.board.cells[xx][yy+1].isPlayer];
				if(playerDefense.endFight === false){
					var next = this;
					playerAttack.fight(playerAttack, playerDefense, next, currentPlayer);
					this.continu = false;
				}
			}
		}

		if(yy-1 >= 0){
			if(this.board.cells[xx][yy-1].isPlayer != null){
				var playerAttack = currentPlayer;
				var playerDefense = this.players[this.board.cells[xx][yy-1].isPlayer];
				if(playerDefense.endFight === false){
					var next = this;
					playerAttack.fight(playerAttack, playerDefense, next, currentPlayer);
					this.continu = false;
				}
			}
		}

	}

	this.getNextPlayer = function(currentPlayer){							//méthode qui passe la main au joueur suivant

		var count = 0;														
		for(var i = 0 ; i < this.players.length ; i++){						//compte le nb de joueur mort
			if(this.players[i].endFight === true){
				count +=1;	
			}
		}

		if(count >= this.players.length-1){									//il ne reste plus qu'un joueur !
			$('#action').html('End Game');	
		}else{
			for(var i = 0 ; i < this.players.length ; i++){					//cherche le joueur suivant qui n'est pas mort
				if(currentPlayer.id + i + 1 >= this.players.length){
					if(this.players[0].endFight === false){
						currentPlayer = this.players[0];
						this.getDeplacement(currentPlayer);
						break;
					}
				}else{
					if(this.players[currentPlayer.id+1+i].endFight === false){
						currentPlayer = this.players[currentPlayer.id+1+i];
						this.getDeplacement(currentPlayer);
						break;
					}
				}
			}
		}

	};

}

