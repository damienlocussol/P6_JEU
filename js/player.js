function Player(id, name, health, force, pos){		//Objet Joueur

	this.id = id;
	this.name = name;
	this.health = health;
	this.force = force;
	this.pos = pos;
	this.weapon = null;
	this.endFight = false;	
	this.firstMove = false;

	this.onBoard = function(game){		//création des divs et insertion dans le DOM à l'init ------------ arg game pour avoir accès aux variables du jeu

		var len = game.board.cells.length;
		var checkCell = false;

		do {
			var Xpos = Math.floor(Math.random()* len);
			var Ypos = Math.floor(Math.random()* len);

			if(game.board.cells[Xpos][Ypos].isAccess === true){
				if(game.board.cells[Xpos][Ypos].isWeapon === null){
					if(game.board.cells[Xpos][Ypos].isPlayer === null){
						if(Xpos+1 < len && game.board.cells[Xpos+1][Ypos].isPlayer === null){
							if(Xpos-1 >= 0 && game.board.cells[Xpos-1][Ypos].isPlayer === null){
								if(Ypos+1 < len && game.board.cells[Xpos][Ypos+1].isPlayer === null){
									if(Ypos-1 >= 0 && game.board.cells[Xpos][Ypos-1].isPlayer === null){
										checkCell = true;
									}
								}
							}
						}
					}
				}
			}

		}
		while(checkCell === false);		//recherche cellule sans obstacle, sans arme et sans joueur, ici ou sur les quatres côtés de cette cellule

		this.pos = {x : Xpos, y : Ypos};
		this.weapon = new Weapon(game.weapons.length, 'ORANGEpoing'+this.id, 10, 'orange', this.pos);	//création d'un objet arme de base pour ce joueur
		this.force = this.weapon.force;

		game.weapons[game.weapons.length] = this.weapon;			//ajout de cette arme dans le tableau des armes
		game.weapons[this.weapon.id].onBoard(game, this.pos);		//affichage de l'arme à l'init

		game.board.cells[Xpos][Ypos].isPlayer = this.id;			//prop isPlayer de Cell = id du joueur

		var div = document.createElement('div');					//div conteneur du joueur
		var size = game.board.cells[0][0].size;
		div.id = 'player'+ this.id;
		div.style.top = (game.board.cells[this.pos.x][this.pos.y].top - game.board.cells[this.pos.x][this.pos.y].size/2) +'px';
		div.style.left = (game.board.cells[this.pos.x][this.pos.y].left + game.board.cells[this.pos.x][this.pos.y].size/2) +'px';
		div.style.zIndex = $('#'+this.pos.x+'-'+this.pos.y).parent().css('zIndex') * 100;
		div.classList.add('player');

				var divTop = document.createElement('div');
				divTop.classList.add('face');
				divTop.classList.add('topPlayer'); 
				divTop.style.width = game.board.cells[this.pos.x][this.pos.y].size*0.8 + 'px';
				divTop.style.height = game.board.cells[this.pos.x][this.pos.y].size*0.8 + 'px';
				divTop.style.top = game.board.cells[this.pos.x][this.pos.y].size * -1 + 'px';
				divTop.style.left = game.board.cells[this.pos.x][this.pos.y].size *1.2 + 'px';

				var divLeft = document.createElement('div');
				divLeft.classList.add('face');
				divLeft.classList.add('leftPlayer');
				divLeft.style.width = game.board.cells[this.pos.x][this.pos.y].size*2*0.8 + 'px';
				divLeft.style.height = game.board.cells[this.pos.x][this.pos.y].size*0.8 + 'px';
				divLeft.style.top = game.board.cells[this.pos.x][this.pos.y].size * 0.2 * -1 +'px';
				divLeft.style.left = game.board.cells[this.pos.x][this.pos.y].size * 0.4 * -1 +'px';

				var divRight = document.createElement('div');
				divRight.classList.add('face');
				divRight.classList.add('rightPlayer');
				divRight.style.width = game.board.cells[this.pos.x][this.pos.y].size*0.8 + 'px';
				divRight.style.height = game.board.cells[this.pos.x][this.pos.y].size*2*0.8 + 'px';
				divRight.style.top = game.board.cells[this.pos.x][this.pos.y].size * 0.2 * -1 +'px';
				divRight.style.left = game.board.cells[this.pos.x][this.pos.y].size  * 0.4 +'px';

				div.append(divTop);
				div.append(divLeft);
				div.append(divRight);

		$('#board').append(div);		//insertion DOM et affichage

		$('#nameWeapon'+(this.id+1)).text(this.weapon.name);	//affichage prop nom du joueur
		$('#forceWeapon'+(this.id+1)).text(this.weapon.force);	//affichage prop force du joueur

	};

	this.playerMove = function(xx ,yy, board, speed, weapons){	//méthode déplacement du joueur

		var firstMove = false;

		var oldPos = this.pos;
		this.pos = {x : xx , y : yy};

		board.cells[xx][yy].isPlayer = this.id;
		board.cells[oldPos.x][oldPos.y].isPlayer = null;

		if(this.IsThereWeapon(board, xx, yy)){

			var currentWeapon = weapons[board.cells[xx][yy].isWeapon];
			currentWeapon.pos = this.pos;

			var oldWeapon = this.weapon;
			var oldWeapon = weapons[this.weapon.id];
			oldWeapon.pos = this.pos;
			board.cells[xx][yy].isWeapon = oldWeapon.id;

			this.weapon = currentWeapon;
			this.force = currentWeapon.force;

			currentWeapon = null;

		}else{
			this.weapon.pos = this.pos;
			board.cells[xx][yy].isWeapon = null;
			var oldWeapon = null;
		}

		if(this.firstMove === false){
			board.cells[oldPos.x][oldPos.y].isWeapon = null;
			this.firstMove = true;
		}

		displayWeapon(this.id, this.pos, this.weapon, oldWeapon, board, speed);
		displayPlayer(this.id, xx, yy, board, oldPos, speed);

	};

	this.IsThereWeapon = function(board, xx, yy){ 	//méthode de vérification de la présence d'une arme

		if(board.cells[xx][yy].isWeapon != null){
			return true;
		}
		else{
			return false;
		}
	};

	this.fight = function(playerAttack, playerDefense, next, currentPlayer){	//méthode combat

		if(playerAttack.endFight === false){									//combat ok

			displayStartAttack(playerAttack.name, playerDefense.name);
			displayHighLight(playerDefense.id, true);

			var that=this;

			$('#attaque'+(playerDefense.id+1)).on('click', function(){			//event onclick attaque pour le joueur attaqué
				$('#attaque'+(playerDefense.id+1)).off('click');
				$('#defense'+(playerDefense.id+1)).off('click');
				var riposte = true;
				that.damage(playerAttack, playerDefense, riposte);

				displayHighLight(playerDefense.id, false);

				that.fight(playerDefense, playerAttack, next, currentPlayer);	//appel récursif tant que le combat n'est pas fini - on change pAttack en pDefense
			});

			$('#defense'+(playerDefense.id+1)).on('click', function(){			//event onclick defense pour le joueur attaqué
				$('#attaque'+(playerDefense.id+1)).off('click');
				$('#defense'+(playerDefense.id+1)).off('click');
				var riposte = false;
				that.damage(playerAttack, playerDefense, riposte);

				displayHighLight(playerDefense.id, false);

				that.fight(playerDefense, playerAttack, next, currentPlayer);
			});

		}else{																	// combat fini --- retour à la boucle principale
			next.board.cells[playerAttack.pos.x][playerAttack.pos.y].isPlayer = null;
			next.continu = true;
			next.getNextPlayer(currentPlayer);

		}

	}

	this.damage = function(playerAttack, playerDefense, riposte){	//méthode dégâts 
		if(riposte){												//attaque
			playerDefense.health -= playerAttack.force;
			this.isAlive(playerDefense, playerAttack);
		}else{														//defense = dégâts / 2
			playerDefense.health -= playerAttack.force/2;
			this.isAlive(playerDefense, playerAttack);
		}
	}

	this.isAlive = function(playerDefense, playerAttack){		//méthode mort ou en vie
		if(playerDefense.health <= 0){
			playerDefense.endFight = true;
			displayEndFight(playerDefense, playerAttack);
		}else{
			displayInfosFight(playerDefense);
		}
	}

}