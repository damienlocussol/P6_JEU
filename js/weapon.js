function Weapon(id, name, force, color, pos){		//Objet Arme

	this.id = id;
	this.name = name;
	this.force = force;
	this.color = color;
	this.pos = pos;

	this.onBoard = function(game, playerPos){		//création des divs d'une arme et insertion dans le DOM à l'init ------ arg game pour avoir accès aux variables du jeu
																											   	     	  //arg playerPos si c'est une arme de base

		var len = game.board.cells.length;			
		var Xpos = Math.floor(Math.random()* len);
		var Ypos = Math.floor(Math.random()* len);

		while(game.board.cells[Xpos][Ypos].isAccess === false || game.board.cells[Xpos][Ypos].isWeapon != null){	//recherche cellule sans obstacle et sans arme
			var Xpos = Math.floor(Math.random()* len);
			var Ypos = Math.floor(Math.random()* len);
		}

		if(playerPos != null){
			this.pos = playerPos;
		}else{
			this.pos = {x : Xpos, y : Ypos};
		}

		game.board.cells[this.pos.x][this.pos.y].isWeapon = this.id;	//prop isWeapon de Cell = id de l'arme

		var div = document.createElement('div');	//div contaneur de l'arme
		var size = game.board.cells[0][0].size;
		div.id = 'weapon' + this.id;
		div.style.top = game.board.cells[this.pos.x][this.pos.y].top + size/4 +'px';
		div.style.left = game.board.cells[this.pos.x][this.pos.y].left + size/4 +'px';
		div.style.zIndex = $('#'+this.pos.x+'-'+this.pos.y).parent().css('zIndex')*100-1;
		div.classList.add('weapon');

				var divTop = document.createElement('div');
				divTop.classList.add('face');
				divTop.classList.add('topWeapon');
				divTop.style.width = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divTop.style.height = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divTop.style.top = game.board.cells[this.pos.x][this.pos.y].size /2 * -1 +'px';
				divTop.style.left = game.board.cells[this.pos.x][this.pos.y].size /2 +'px';
				divTop.style.background = this.color;

				var divLeft = document.createElement('div');
				divLeft.classList.add('face');
				divLeft.classList.add('leftWeapon');
				divLeft.style.width = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divLeft.style.height = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divLeft.style.top = game.board.cells[this.pos.x][this.pos.y].size /4 * -1 +'px';
				divLeft.style.left = game.board.cells[this.pos.x][this.pos.y].size * 0 +'px';

				var divRight = document.createElement('div');
				divRight.classList.add('face');
				divRight.classList.add('rightWeapon');
				divRight.style.width = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divRight.style.height = game.board.cells[this.pos.x][this.pos.y].size/2 + 'px';
				divRight.style.top = game.board.cells[this.pos.x][this.pos.y].size * 0 +'px';
				divRight.style.left = game.board.cells[this.pos.x][this.pos.y].size /4 +'px';

				div.append(divTop);
				div.append(divLeft);
				div.append(divRight);

		$('#board').append(div);	//insertion DOM et affichage

	}
}