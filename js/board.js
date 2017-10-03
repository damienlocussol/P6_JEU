function Board (nb, size){		//Objet du plateau de jeu carré ------- arg nb = nombre le lignes et de colonnes
																	  //arg size = taille en pixels d'une cellule

	this.cells = (function(){	//création de toutes les cellules du plateau

		var cells = [];			//tableau a 2 dimensions -> tableau1 contient nb cellules, tableau2.... jusqu'à nb 

		for(var i = 0; i < nb; i++){
			cells[i] = [];
			for(var j = 0; j < nb; j++){
				cells[i][j] = new Cell(String(i)+'-'+String(j), size, i * size, j*size, null, null, false); // création d'un objet Cell pour chaque cellule
			}
		}

		return cells;

	})();

	this.onBoard = function(board){		//création des divs cells et insertion dans le DOM à l'init

		for(var i = 0; i < board.cells.length; i++){

			for(var j = 0; j < board.cells[i].length; j++){
				var div = document.createElement('div');					//div conteneur cellule
				div.style.top = board.cells[i][j].top + 'px';
				div.style.left = board.cells[i][j].left + 'px';
				div.classList.add('cells');

				if(board.cells[i][j].isAccess === false){
					var block = document.createElement('div');				//div conteneur obstacle
					block.id = String((i+1)*100)+'-'+String((j+1)*100);
					block.style.left = board.cells[i][j].left + 'px';
					block.style.top = board.cells[i][j].top + 'px';
					block.style.position = 'absolute';

					var bdivTop = document.createElement('div');
					bdivTop.classList.add('face');
					bdivTop.classList.add('top');
					bdivTop.style.width = size + 'px';
					bdivTop.style.height = size + 'px';
					bdivTop.style.backgroundColor = '#333';
					bdivTop.style.transform = 'translate('+(size/4)+'px , '+(size/4*-1)+'px)';

					var bdivLeft = document.createElement('div');
					bdivLeft.classList.add('face');
					bdivLeft.classList.add('left');
					bdivLeft.style.width = size/4 + 'px';
					bdivLeft.style.height = size + 'px';
					bdivLeft.style.top = size/8 *-1 +'px';
					bdivLeft.style.left = 0+'px';

					var bdivRight = document.createElement('div');
					bdivRight.classList.add('face');
					bdivRight.classList.add('right');
					bdivRight.style.width = size + 'px';
					bdivRight.style.height = size/4 + 'px';
					bdivRight.style.top = size - (size/4) +'px';
					bdivRight.style.left = size/8 +'px';

					block.append(bdivTop);
					block.append(bdivLeft);
					block.append(bdivRight);
				}

				var divTop = document.createElement('div');
				divTop.id = board.cells[i][j].id;
				divTop.classList.add('face');
				divTop.classList.add('top');
				divTop.style.width = size + 'px';
				divTop.style.height = size + 'px';

				var divLeft = document.createElement('div');
				divLeft.classList.add('face');
				divLeft.classList.add('left');
				divLeft.style.width = size/2 + 'px';
				divLeft.style.height = size + 'px';
				divLeft.style.top = size/4 +'px';
				divLeft.style.left = size/2*-1 +'px';

				var divRight = document.createElement('div');
				divRight.classList.add('face');
				divRight.classList.add('right');
				divRight.style.width = size + 'px';
				divRight.style.height = size/2 + 'px';
				divRight.style.top = size +'px';
				divRight.style.left = size/4*-1 +'px';

				div.append(divTop);
				div.append(divLeft);
				div.append(divRight);

				$('#board').append(div);	//insertion DOM et affichage
				$('#board').append(block);	//insertion DOM et affichage

			}
		}

		//algorithme disposition Z Index pour le plateau isométrique -- le player passe au-dessus ou au-dessous des obstacles
		var count = 0; 
		var zidx = 1;

		for ( var i = nb-1 ; i >= 0 ; i--){		//moitié supérieure du plateau (pour nb -> 0     de 0 a count)

			for(var x = 0 ; x <= count ; x ++){

				if(board.cells[i+x][x].isAccess === false){	
					$('#'+(i+x+1)*100+'-'+(x+1)*100).css('zIndex', zidx*100);	//zindex obstacle
				}

				$('#'+String(i+x)+'-'+String(x)).parent().css('zIndex', zidx);	//zindex cellule
				zidx +=1;
			}

			count+=1

		}


		for(var i = 1 ; i <= nb - 1 ; i++){		//moitié inférieure du plateau (pour 1 -> nb     de i+1 a nb)

			var count2 = 0;

			for(var x = i ; x <= nb-1 ; x++){

				if(board.cells[count2][x].isAccess === false){	
					$('#'+(count2+1)*100+'-'+(x+1)*100).css('zIndex', zidx*100);	//zindex obstacle
				}

				$('#'+String(count2)+'-'+ String(x)).parent().css('zIndex', zidx);	//zindex cellule
				count2+=1;
				zidx+=1

			}
		}
	};

}
