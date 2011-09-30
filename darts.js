var Board;

function valueSelected( val ) {
	alert( val );
}


$(document).ready( function() {
/*	$.getScript('darts.js', function( data, statusText ) {
		alert('123');
		Board = new DartBoard( "#board", 600, 600 ); 
		Board.draw();
	});
*/

	Board = new DartBoard( {
		elem: '#board',
		selectionCallback : valueSelected,
	});

});


