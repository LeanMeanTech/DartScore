function DartBoard( parms ){
	this.elem = parms.elem;
	this.selectionCallback = parms.selectionCallback;
	this.hoverCallback = parms.hoverCallback;

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


DartBoard.prototype.getSlicePath = function( r1, r2 ) {

	var offs1 = this.getSliceOffsets( r1 );
	var offs2 = this.getSliceOffsets( r2 );	

	var str = "M " + (this.center - offs1.offX) + " " + (this.center + offs1.offY) + " "; 
	str += "S " + this.center + " " + offs1.curveApexY  + " " + (this.center + offs1.offX) + " " + (this.center + offs1.offY) + " ";
	str += "L " + (this.center + offs2.offX) + " " + (this.center + offs2.offY) + " ";
	str += "S " + this.center + " " + offs2.curveApexY + " " + (this.center - offs2.offX) + " " + (this.center + offs2.offY) + " Z"; 
	return str;
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

	this.slicePath = this.getSlicePath( 0, radius );
	this.doubleSlicePath = this.getSlicePath( radius*0.90, radius );
	this.tripleSlicePath = this.getSlicePath (radius *0.60, radius *0.65);

	console.log(this.slicePath);

	// Clockwise from bottom
	var numbers = [ 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17 ];


	for( var i=0; i < numbers.length; i++) {
		var value = numbers[i];
		var slice = this.paper.path( this.slicePath );
		var doubleSlice = this.paper.path( this.doubleSlicePath );
		var tripleSlice = this.paper.path( this.tripleSlicePath );
		

		slice.rotate(  i*18  , this.center, this.center );		
		doubleSlice.rotate(  i*18  , this.center, this.center );		
		tripleSlice.rotate( i*18, this.center, this.center );

		var pointText = this.paper.text( this.center, this.center+ 1.12*radius, value )
			.attr( {'font-size': radius/6 , stroke: this.boardColors.white, fill: this.boardColors.white} );

		pointText.rotate( i*18, this.center, this.center );
		pointText.rotate( -i*18, this.center, this.center + 1.12*radius );


		if( i % 2 == 0 ) {
			slice.node.color = this.boardColors.black;
			doubleSlice.node.color = this.boardColors.red;
			tripleSlice.node.color = this.boardColors.green;
		} else {
			slice.node.color = this.boardColors.light;
			doubleSlice.node.color = this.boardColors.green;
			tripleSlice.node.color = this.boardColors.red;
		}

		slice.attr( { stroke: this.boardColors.white, fill: slice.node.color, 'stroke-width': 1 } );
		
		doubleSlice.attr( { stroke: this.boardColors.white, fill: doubleSlice.node.color, 'stroke-width': 1 } );
		tripleSlice.attr( { stroke: this.boardColors.white, fill: tripleSlice.node.color, 'stroke-width': 1 } );

		slice.node.pointval = value;
		doubleSlice.node.pointval = 'D' + value;
		tripleSlice.node.pointval = 'T' + value;	
	
		// Save a reference to the raphael object
		slice.node.thing = slice;
		doubleSlice.node.thing = doubleSlice;
		tripleSlice.node.thing  = tripleSlice;

	}
		
	this.singleBull = this.paper.circle( this.center, this.center, radius/8 )
				.attr( { fill: this.boardColors.green } );
	this.singleBull.node.color = this.boardColors.green;
	this.singleBull.node.thing = this.singleBull;
	this.singleBull.node.pointval = 25;

	this.doubleBull = this.paper.circle( this.center, this.center, radius/16 )
				.attr( { fill: this.boardColors.red } );

	this.doubleBull.node.pointval = 50;
	this.doubleBull.node.color = this.boardColors.red;
	this.doubleBull.node.thing = this.doubleBull;

	// Add handlers
	var board = this;
	$('svg *').click( function(e) {
		if( typeof(  board.selectionCallback === 'function') ) {
			if( typeof( this.pointval ) !== 'undefined' ) {
				board.selectionCallback( this.pointval );
			}
		}
	}).bind( 'mouseover', function() {
		console.log( this );
		if( typeof(this.thing) !== 'undefined' ) {
			this.thing.attr({ fill : board.boardColors.highlight });
			if( typeof(board.hoverCallback) === 'function' ) {
				board.hoverCallback( this.pointval );
			}

		}
	}).bind( 'mouseout', function() {
		if( typeof(this.thing) !== 'undefined' ) {
			this.thing.attr( { fill: this.color } );
		}
	});




};

