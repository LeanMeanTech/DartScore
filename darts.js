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


var SelectedPlayerId;

function refreshPlayerList( force ) {

	if( force ) {
		$('#playerselect fieldset .ui-controlgroup-controls div').remove();
	}

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
			$('#playerselect span').bind( 'taphold', function(e) {
				// jquery mobile DOM mojo.  Ugly, but it works
				
				// the 'chkName' id
				var id = $(this).parent().parent().find('input').attr('id');
				SelectedPlayerId = id.split('_')[1];
				

				console.log(id);
	
				var playerName = $(this).find('span').html();	
				
				$('.playername').html( playerName );
				$('#playerdetailslink').click();
		
			
			});

		}

	});


}


// TODO: If the bind is put in the .live() below, it ends up adding too many.  Not sure
// the best place for this, but works here.
$( function() {
	$('#btn_addplayer').bind( 'click', function() {

		var newPlayerName = $('#input_new_player').val();
		// Clear the value for the next entry
		$('#input_new_player').val('');
	
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




function closeDialog() {
	$('.ui-dialog').dialog('close')
}

function deletePlayer() {
	console.log('deletePlayer');
	getDB().deletePlayerById(SelectedPlayerId, function() {
		// force regeneration of the player list
		refreshPlayerList(true);
		closeDialog();	
	});
}
