var Board;


function valueSelected( val ) {
	alert( 'value selected: ' + val );
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

});


