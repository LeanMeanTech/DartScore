var SmallBoard;
var Board;

var INITIAL_SCORE = 301;
var THROWS_PER_TURN = 3;

var Players = ['Jeff', 'Artur'];
var Scores = [];
var PrevScore; // In case of bust and we need to revert;
var CurrentPlayer = 0;

var ThrowNum = 0;



function valueSelected( val ) {

	if( val == Scores[CurrentPlayer] ) {
		alert( Players[CurrentPlayer] + ' wins!');
		return;
	}

	if( val > Scores[CurrentPlayer] ) {
		alert('Bust!');
		Scores[CurrentPlayer] = PrevScore;
		updateScores();
		nextPlayer();
		return;		

	}
	
	Scores[CurrentPlayer] -= val; 
	updateScores();
	
	ThrowNum++;
	if( THROWS_PER_TURN == ThrowNum )
	{
		nextPlayer();
	}

	$('#bigboard').hide();
	$('#smallboard').show();


}



function updateScores( ) {

	for( var i=0; i < Players.length; i++ ) {
		$('#players div span').eq(i).html( Scores[i] );
	}

}


function nextPlayer(){
	$('#players div').eq(CurrentPlayer).removeClass( 'highlighted_player' );
	
	CurrentPlayer = (CurrentPlayer+1) % Players.length;
	ThrowNum = 0;
	PrevScore = Scores[CurrentPlayer];	

	console.log(CurrentPlayer);
	$('#players div').eq(CurrentPlayer).addClass( 'highlighted_player' );


}



$(document).ready( function() {

	// Calculate ideal board size based on dimensions of the whole page
	
	SmallBoard = new DartBoard( {
		elem	: '#smallboard',
		highlightSelection : false,

		//selectionCallback : valueSelected,
		onTouchDown : function( value ) {
			console.log('ffff');
			$('#smallboard').hide();
			$('#bigboard').show();

		},
		
		onTouchUp : function( value ) {


		}
	});

	Board = new DartBoard( {
		elem : '#bigboard',
		onSelected	: valueSelected,
		onHover 	: function( value ) {
			$('#score').val( value );
		}

	});


	$('#bigboard').hide();


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


