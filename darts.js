$('#mainmenu').live( 'pagecreate', function() {


});

$('#gameselect').live( 'pagecreate', function() {
	var games = getGames();

	for( var i=0; i < games.length; i++ ) {
		console.log( games[i].name );


		$('#gamelist').append( '<p><a href="#playerselect" data-role="button">' + games[i].name + '</a></p>' );
	}


//	$('#mainmenu div').append('<p><a href="#scoreselect" data-role="button">Score Select</a></p>');
});



$('#playerselect').live( 'pagecreate', function() {

	var players = ['Jeff', 'Artur'];


	for( var i = 0; i < players.length; i++ ) {
		var player = players[i];
		console.log('Adding ' + player);
		var chkName = 'c_' + player;
		$('#playerselect legend').after( '<input type="checkbox" name="' +chkName + '" class="custom" /><label for="' + chkName + '">' + player + '</label>');
	}

});


