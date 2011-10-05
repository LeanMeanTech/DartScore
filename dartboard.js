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
		highlight : '#ff0'
	}

//	this.draw();
	this.draw2();
}


// Return offsets along the slice
DartBoard.prototype.getSliceOffsets = function( radius ) {
	var ret = {};
	
	ret.offX = radius * Math.sin( (2 * Math.PI) / 40 );
	ret.offY = Math.sqrt( Math.pow(radius, 2) - Math.pow(ret.offX, 2) );
	ret.curveApexY = this.center + radius * 1/(Math.cos( 2*Math.PI/40 ));
	
	return ret;
}


DartBoard.prototype.draw2 = function() {
	var offset = $(this.elem).offset();
	this.paper = Raphael( offset.left, offset.top, $(this.elem).width(), $(this.elem).height());

	var radius = (this.size/2) * .72;
	this.center = this.size/2;

	this.outterBoard = this.paper.circle(
		this.center, this.center, this.size/2)
		.attr( 'fill', this.boardColors.black );

	//this.logo = this.paper.image( 'http://www.leanmeantech.com/static/images/logo.png', center-(292/2), center*2 - 100, 296, 68); 

	var scoreRingOffs = this.getSliceOffsets( radius );

	var slicePath = "M " + this.center + " " + this.center + " ";

	slicePath += "L " + (this.center - scoreRingOffs.offX) + " " + (this.center + scoreRingOffs.offY) + " "; 
	slicePath += "S " + this.center + " " + scoreRingOffs.curveApexY  + " " + (this.center + scoreRingOffs.offX) + " " + (this.center + scoreRingOffs.offY) + " Z"; 

	this.slicePath = slicePath;


	var doubleRingOffs = this.getSliceOffsets( radius * 0.90 );
	
	var doubleSlicePath = "M " + (this.center - scoreRingOffs.offX) + " " + (this.center + scoreRingOffs.offY) + " "; 
	doubleSlicePath += "S " + this.center + " " + scoreRingOffs.curveApexY  + " " + (this.center + scoreRingOffs.offX) + " " + (this.center + scoreRingOffs.offY) + " ";
	doubleSlicePath += "L " + (this.center + doubleRingOffs.offX) + " " + (this.center + doubleRingOffs.offY) + " ";
	doubleSlicePath += "S " + this.center + " " + doubleRingOffs.curveApexY + " " + (this.center - doubleRingOffs.offX) + " " + (this.center + doubleRingOffs.offY) + " Z"; 

	this.doubleSlicePath = doubleSlicePath;	


	console.log(this.slicePath);

	// Clockwise from bottom
	var numbers = [ 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17 ];


	for( var i=0; i < numbers.length; i++) {
		var value = numbers[i];
		var slice = this.paper.path( this.slicePath );
		var doubleSlice = this.paper.path( this.doubleSlicePath );
		
		var pointText = this.paper.text( this.center, this.center+ 1.12*radius, value )
			.attr( {'font-size': radius/6 , stroke: this.boardColors.white, fill: this.boardColors.white} );

		
		doubleSlice.rotate(  i*18  , this.center, this.center );		
		slice.rotate(  i*18  , this.center, this.center );		
		pointText.rotate( i*18, this.center, this.center );
		pointText.rotate( -i*18, this.center, this.center + 1.12*radius );


		if( i % 2 == 0 ) {
			slice.node.color = this.boardColors.black;
			doubleSlice.node.color = this.boardColors.red;
		} else {
			slice.node.color = this.boardColors.light;
			doubleSlice.node.color = this.boardColors.green;
		}

		slice.attr( { stroke: this.boardColors.white, fill: slice.node.color, 'stroke-width': 1 } );
		
		doubleSlice.attr( { stroke: this.boardColors.white, fill: doubleSlice.node.color, 'stroke-width': 1 } );


		slice.node.pointval = value;
		
		// Save a reference to the raphael object
		slice.node.thing = slice;

		board = this;

		$(slice.node).click( function(e) {
			board.selectionCallback( this.pointval );
			console.log('click ', this.pointval );
		});

		$(slice.node).bind( 'mouseover', function() {
			console.log( this.pointval );
			this.thing.attr({ fill : board.boardColors.highlight });
		}).bind( 'mouseout', function() {
			this.thing.attr( { fill: this.color } );
		});

		

	}
		

	this.singleBull = this.paper.circle( this.center, this.center, radius/8 )
				.attr( { fill: this.boardColors.green } );


	this.doubleBull = this.paper.circle( this.center, this.center, radius/16 )
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



