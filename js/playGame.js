
function startGame(game){				//positionne les éléments

		game.board.onBoard(game.board);					//board

		for(var i = 0; i < game.weapons.length; i++){	//armes sur le plateau (pas celles des joueurs)
			game.weapons[i].onBoard(game);
		}

		for(var i = 0; i < game.players.length; i++){	//joueurs -- et leurs armes par weapons.onBoard
			game.players[i].onBoard(game, null);
		}

		var currentPlayer = game.players[0];			//initialise le joueur 1

		game.getDeplacement(currentPlayer);				//lance la boucle principale du jeu
}

function playGame(nb){					//initialise le plateau ----  arg nb -> nombre de cellules / lignes et colonnes

	var size = initDimensions(nb);		//initialise la taille du plateau en fonction de la taille de l'écran

	var game = new Game(nb, size, 500);	//instancie l'objet game qui gère tout le déroulement du jeu

	$('#startGame').on('click', function(){
		var nbPlayers = $('#nbPlayers').val();
		displayPlayerInfos(nbPlayers, game);	//lance la création du nombre de joueurs voulu
	});

}

$(function(){
	playGame(10);		//lancement automatique du jeu
});



//Réutilisation :
//Copier le code html de base pour avoir accès aux différents id repris dans le code
//Copier les liens vesr les fichiers js dans l'ordre
//Appeler la fonction playGame avec le nombre de cellules voulus en paramètres

