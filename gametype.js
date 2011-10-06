function GameType( p ) {
	var that = {}
	that.name = p.name;
	that.href= p.href;
		
	return that;
}


function X01 (){
	var that = new GameType( {name: 'x01'} );

	return that;
}

function Cricket() {
	var that = GameType( {name: 'Cricket'} );
	return that;
}

function getGames() {
	return [
		new X01(),
		new Cricket(),


	];

}

