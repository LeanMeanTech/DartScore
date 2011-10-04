function DartBoard( parms ){
	this.elem = parms.elem;
	this.selectionCallback = parms.selectionCallback;
	this.zoomFactor = 2;

	// Calculate the board size 
	this.size = Math.min( $(this.elem).height(), $(this.elem).width() );

	console.log('size: ' + this.size );

	this.boardColors = {
		black: '#000',
		white: '#fff',
		red: '#f00',
		light: '#E1DCB7',
		green: '#008C00',

	}

//	this.draw();
	this.draw2();
}



DartBoard.prototype.draw2 = function() {
	var offset = $(this.elem).offset();
	this.paper = Raphael( offset.left, offset.top, $(this.elem).width(), $(this.elem).height());
	

	this.outterBoard = this.paper.circle(
		this.size/2, this.size/2, this.size/2)
		.attr( 'fill', this.boardColors.black )
		.click( function() {
			alert( 'board clicked');
		});	

	//var slicePath = "M 0 0 L 15.643 98.769 A 100 100 0 0 1 -15.643 98.769 Z";

	var r = this.size/2;

	var offX = r * Math.sin( (2 * Math.PI) / 40 );  

	var offY = Math.sqrt( Math.pow(r, 2)   - Math.pow(offX,2) );
	
	console.log( 'offX: ' + offX + ' offY: ' + offY );


	var slicePath = "M " + r + " " + r + " ";
	slicePath += "L " + (r - offX) + " " + (r + offY) + " "; 
	slicePath += "L " + (r + offX) + " " + (r + offY) + " Z"; 

	this.slicePath = slicePath;

	var numbers = [ 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17 ];


	for( var i=0; i < numbers.length; i++) {
		var value = numbers[i];
		console.log( value );
		var slice = this.paper.path( this.slicePath );
		slice.rotate(  i*18  , r, r );		

		if( i % 2 == 0 ) {
			slice.attr( { fill: this.boardColors.black } );
		} else {
			slice.attr( { fill: this.boardColors.light } );
		}

	}
		

	this.singleBull = this.paper.circle( r, r, r/15 )
				.attr( { fill: this.boardColors.green } );


	this.doubleBull = this.paper.circle( r, r, r/30 )
				.attr( { fill: this.boardColors.red } );


};

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
				
				var origOffX = ((board.canvas.width/2) - x) * (Math.PI/2);
				var origOffY = ((board.canvas.height/2) - y) * (Math.PI/2);

				console.log( 'origOffX: ' + origOffX + ' origOffY: ' + origOffY );

				// redraw, zoomed in
				context.drawImage(	board.boardImage,
							origX-(zoomCropSize/2) + origOffX, origY-(zoomCropSize/2) + origOffY, // src coordinates
							zoomCropSize, zoomCropSize,
							0, 0, // dst coordinates
							board.size, board.size );
				
				board.isMouseDown = true;

			//	context.drawImage( board.boardImage, 0, 0, 200, 200, 0, 0, board.size, board.size );

			} );


			$(board.canvas).bind( 'mousemove', function(e) {
				if( board.isMouseDown ) {

					var x = e.pageX - this.offsetLeft;
					var y = e.pageY - this.offsetTop;

					var image = context.getImageData( x, y, 1, 1 );
				
					var r = image.data[0];
					var g = image.data[1];
					var b = image.data[2];
					var a = image.data[3];


					console.log( 'R:' + r + 'g: ' + g + 'b: ' + b, 'a: ' + a );
	
					image.data[0] = 255-image.data[0];
					image.data[1] = 255-image.data[1];
					image.data[2] = 255-image.data[2];
					
					context.putImageData( image, x, y );

					//console.log( x + ',' + y ); 
				}


			});

			$(board.canvas).bind( 'mouseup', function(e) {

				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;

				console.log( "up: " + x + "," + y );

				board.canvas.width = board.canvas.width;
				context.drawImage( board.boardImage, 0, 0, board.size, board.size );

				board.isMouseDown = false;
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



