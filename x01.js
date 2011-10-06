var Board;

var INITIAL_SCORE = 301;
var THROWS_PER_TURN = 3;

var Players = ['Jeff', 'Artur'];
var Scores = [];
var CurrentPlayer = 0;

var ThrowNum = 0;



function valueSelected( val ) {

	Scores[CurrentPlayer] -= val;
	updateScores();
	
	ThrowNum++;
	if( THROWS_PER_TURN == ThrowNum )
	{
		ThrowNum = 0;
		nextPlayer();
	}

}



function updateScores( ) {

	for( var i=0; i < Players.length; i++ ) {
		$('#players div span').eq(i).html( Scores[i] );
	}

}

function nextPlayer(){
	$('#players div').eq(CurrentPlayer).removeClass( 'highlighted_player' );
	
	CurrentPlayer = (CurrentPlayer+1) % Players.length;
	
	console.log(CurrentPlayer);
	$('#players div').eq(CurrentPlayer).addClass( 'highlighted_player' );


}



$(document).ready( function() {

	// Calculate ideal board size based on dimensions of the whole page
	var boardSize = Math.min( $('#board').height(), $('#boad').width() );
	boardSize *= 0.90;
	
	Board = new DartBoard( {
		elem : '#board',
		size : boardSize ,
		selectionCallback : valueSelected,
		hoverCallback : function( value ) {
			$('#score').html( value );

		}
	});


	for( var i=0; i < Players.length; i++ ) {
		var player = Players[i];
		console.log( player );
		$('#players').append( '<div>' + player + '<span>0</span></div>' );


		Scores[i] = INITIAL_SCORE;

	}

	updateScores();
	CurrentPlayer = -1;
	nextPlayer();


});


