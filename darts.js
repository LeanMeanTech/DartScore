var Board;

function valueSelected( val ) {
	alert( 'value selected: ' + val );
}


$('#scoreselect').live( 'pagecreate', function() {
/*	$.getScript('darts.js', function( data, statusText ) {
		alert('123');
		Board = new DartBoard( "#board", 600, 600 ); 
		Board.draw();
	});
*/

	// Calculate ideal board size based on dimensions of the whole page
	var boardSize = Math.min( $('html').height(), $('html').width() );
	boardSize *=0.90;
	$('#board').height( boardSize ).width( boardSize );
	
	Board = new DartBoard( {
		elem : '#board',
		size : boardSize ,
		selectionCallback : valueSelected,
		hoverCallback : function( value ) {
			console.log('hover: ' + value);
			$('#score').html( value );

		}
	});

});


