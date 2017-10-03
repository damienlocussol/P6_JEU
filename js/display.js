function displayWeapon(id, pos, weapon, oldWeapon, board, speed){					//affichage de l'arme du joueur en cours et de l'ancienne arme si elle existe

		var topY = board.cells[pos.x][pos.y].top + board.cells[pos.x][pos.y].size/4;
		var leftX = board.cells[pos.x][pos.y].left + board.cells[pos.x][pos.y].size/4;

		var zIdx = parseInt($('#board #'+String(pos.x)+'-'+String(pos.y)).parent().css('zIndex'))*100-1;

		$('#weapon'+weapon.id).animate({
		    top: topY,
		    left: leftX,
		}, speed, function(){
			if(oldWeapon != null){
				var oldTopY = board.cells[pos.x][pos.y].top + board.cells[pos.x][pos.y].size/4;
				var oldLeftX = board.cells[pos.x][pos.y].left + board.cells[pos.x][pos.y].size/4;
				$('#weapon'+oldWeapon.id).css({'top': oldTopY , 'left' : oldLeftX , 'zIndex' : zIdx});
			}
		});

		$('#nameWeapon'+(id+1)).text(weapon.name);
		$('#forceWeapon'+(id+1)).text(weapon.force);
}

function displayPlayer(id, left, top, board, oldPos, speed){						//affichage du joueur en cours

	var topY = board.cells[left][top].top  - board.cells[left][top].size/2 +'px';
	var leftX = board.cells[left][top].left + board.cells[left][top].size/2 +'px';

	var zIdxFinal = parseInt($('#board #'+String(left)+'-'+String(top)).parent().css('zIndex'))*100;

	$('#player'+id).animate({
		top: topY,
		left: leftX
	},{
		duration: speed,
		start: function() {							//modification temporaire du zindex du joueur pour qu'il passe bien en-dessous ou au-dessus des obstacles
    		if(top < oldPos.y){ //haut
				zIdx = parseInt($('#board #'+String(left-1)+'-'+String(top)).parent().css('zIndex'))*100-1;
			}
			else if(top > oldPos.y){ //bas
				zIdx = parseInt($('#board #'+String(left+1)+'-'+String(top)).parent().css('zIndex'))*100+1;
			}
			else{
				zIdx = zIdxFinal;
			}
    		$('#player'+id).css('zIndex' , zIdx);
		},
		complete: function(){
			$('#player'+id).css('zIndex' , zIdxFinal);
		}
	});

}

function displayCellsOptions(board){			//affichage des possibilités de déplacement d'un joueur

	for(var i = 0; i < board.cells.length; i++){
		for(var j = 0; j < board.cells[i].length; j++){
			if(board.cells[i][j].isHighLight === true){
				$('#'+board.cells[i][j].id).addClass('highLight');
			}
		}
	}
}

function displayPlayerInfos(nbPlayers, game){			//a l'init - création des joueurs

	$('#startGame').off('click');
	
	for(var i = 0 ; i < nbPlayers ; i++){
		var player = '<p id="namePlayer'+(i+1)+'">Player '+(i+1)+' : <input type="text" id="namePlayer'+(i+1)+'" class="namePlayer"></p>';
		$('#startInfos').append(player);
	}

	$('#startGame').on('click', function(){

		for(var i = 0 ; i < nbPlayers ; i++){
			game.players[i] = new Player(i, $('input#namePlayer'+(i+1)).val(), 100);

			var playerInfos =   '<div id="playerInfos'+(i+1)+'" class="infos">'+
								'<div id="name'+(i+1)+'">'+game.players[i].name+'</div>'+
								'<div class="progress"><div class="progressPlayer" id="progress'+(i+1)+'"></div></div>'+
								'<div><span id="nameWeapon'+(i+1)+'"></span> / <span id="forceWeapon'+(i+1)+'"></span></div>'+
        						'<div id="choix'+(i+1)+'"><form><span>Defense : </span><input type="radio" name="selectdefense'+(i+1)+'" id="attaque'+(i+1)+'"><label for="attaque'+(i+1)+'">&nbsp;</label>'+
        																	          '<input type="radio" name="selectdefense'+(i+1)+'" id="defense'+(i+1)+'" checked><label for="defense'+(i+1)+'">&nbsp;</label>'+
        										         '</form></div></div>';

        	$('#playerInfos').append(playerInfos);   

		}

		$('#startInit').css('display','none');
		startGame(game);						// une fois les joueurs créés on appelle startGame qui va positionner tous les élements
	});
	
}

function initDimensions(nb){					//initialise la taille du board en fonction de la taille de l'écran

	var screen = window.innerWidth;
	var coef = 1.7320508075688772;				//rapport entre la moitié de la hauteur d'une cellule et la moitié de sa largeur (isométrie)

	if(screen < 768){
		var size = screen / nb / coef;		//hauteur d'une cellule -> toute la largeur
		
	}else{
		var size = screen * 0.6 / nb / coef;	//hauteur d'une cellule -> 60% de la largeur
	}

	$('#containerBoard').css('height' , size * nb + size*2);		// hauteur du container du board
	$('#board').css({'top': size*nb/2+size+size/2, 'left' : 0});	//positionnement du board

	return size;
}

function displayHighLight(id, bool){									//coloration du joueur en cours

	if(bool){
		$('#player'+id+' div.topPlayer').addClass('playerHighlight');
		$('#playerInfos'+(id+1)).addClass('playerInfosHighlight');
	}else{
		$('#player'+id+' div.topPlayer').removeClass('playerHighlight');
		$('#playerInfos'+(id+1)).removeClass('playerInfosHighlight');
	}
}

function displayStartAttack(playerAttack, playerDefense){				//infos sur le combat en cours
	$('#action').html(playerAttack +' attaque<br>'+playerDefense +' doit choisir attaque ou defense');	
}

function displayEndFight(playerDefense, playerAttack){					//affichage informations sur le combat en cours quand un joueur est mort
	$('#progress'+(playerDefense.id+1)).css('width', 0);
	$('#player'+playerDefense.id).css('display', 'none');
	$('#weapon'+playerDefense.weapon.id).css('display','none');
	$('#action').html(playerDefense.name +' is DEAD '+playerAttack.name+' a gagné !');
}

function displayInfosFight(playerDefense){								//affichage informations sur le joueur en cours de combat
	$('#progress'+(playerDefense.id+1)).css('width', playerDefense.health+'%');
}
			