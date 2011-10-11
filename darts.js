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


function refreshPlayerList() {

	// Load players from the database
	getDB().getPlayers( function( players) {

		var refresh = false;

		for( var i = 0; i < players.length; i++ ) {
			var player = players[i];
			console.log('Adding ' + player.name);
			var chkName = 'cp_' + player.id ;

			// only add elements that aren't already displayed
			if ($("#" + chkName).length ==  0){
				var playerHtml = '<input type="checkbox" id="' + chkName + '" name="' +chkName + '" class="custom" /><label for="' + chkName + '">' + player.name + '</label>';
				$('#btn_addplayer_1').before(playerHtml);
				console.log(playerHtml);
				refresh = true;
			}
		}

		if( refresh ) {
			$("#playerselect").page('destroy').page();
		}

	});


}


// TODO: If the bind is put in the .live() below, it ends up adding too many.  Not sure
// the best place for this, but works here.
$( function() {
	$('#btn_addplayer').bind( 'click', function() {

		var newPlayerName = $('#input_new_player').val();
	
		console.log('adding player: ' + newPlayerName );
		getDB().addPlayer(newPlayerName, function() {
			// refresh page stylin
			refreshPlayerList();
		});

	});
});


$('#playerselect').live( 'pagecreate', function() {

	refreshPlayerList();
});


