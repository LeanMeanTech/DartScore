

function DartBoard( parms ){
	this.elem = parms.elem;
	this.selectionCallback = parms.selectionCallback;
	this.zoomFactor = 2;
	this.draw();
}


DartBoard.prototype.draw = function( ) {
	
	this.boardImage = new Image();
	
	var board = this;

	$(this.boardImage).load( function() {
		
		board.canvas = document.createElement('canvas');

		board.size = Math.min( $(board.elem).width(), $(board.elem).height() );

		board.canvas.width = board.size;
		board.canvas.height = board.size;

		$(board.elem).append( board.canvas );

		var context = board.canvas.getContext('2d');
		context.drawImage( board.boardImage, 0, 0, board.size, board.size );

		if( typeof board.selectionCallback == 'function' ) {
			
			$(board.canvas).bind( 'mousedown', function(e) { 

				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;

				console.log( "down: " + x + "," + y );


				// x, y are the coords that were 'clicked' on the resized image.
				// now we map them to the original image
				var ratio = board.boardImage.width/board.canvas.width;

				var origX = ratio*x;
				var origY = ratio*y;

				console.log (origX + "," + origY);


				// Clear the canvas
				board.canvas.width = board.canvas.width;

				var zoomCropSize = origX / board.zoomFactor;

				console.log( "zoomCropSize: " + zoomCropSize );

				// the zoomed x and y should be offset from the center the exact
				// same % as in the unzoomed case, so when we zoom in the mouse (or finger)
				// is still pointing to the same place on the baord
				
				var origOffX = (board.canvas.width/2)


				// redraw, zoomed in
				context.drawImage(	board.boardImage,
							origX-(zoomCropSize/2), origY-(zoomCropSize/2), // src coordinates
							zoomCropSize, zoomCropSize,
							0, 0, // dst coordinates
							board.size, board.size );
				


			//	context.drawImage( board.boardImage, 0, 0, 200, 200, 0, 0, board.size, board.size );

			} );


			$(board.canvas).bind( 'mouseup', function(e) {

				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;

				console.log( "up: " + x + "," + y );

				board.canvas.width = board.canvas.width;
				context.drawImage( board.boardImage, 0, 0, board.size, board.size );
			});
		}

	});

	this.boardImage.src = 'b.png';
};
/*
	$(this.canvas).bind( 'touchend', function(e) {
	
		context.drawImage( board.boardImage, 0, 0, board.width, board.height );

	});

*/



