
function pointFromEvent(e) { 
	// point is calculated different for 'touch' vs 'mouse' case	
	var ret = {};

	if( typeof( e.originalEvent.touches ) == 'undefined' ) {
		// mouse case
		ret.x = e.pageX;
		ret.y = e.pageY;
	} else {
		ret.x = e.originalEvent.touches[0].pageX;
		ret.y = e.originalEvent.touches[0].pageY;
	}
	

	return ret;
}




function DartBoard( parms ){
	
	// Default values, if not overridder by parameters
	var defaults = {
		highlightSelection : true,
		zoomSelect : true,
		zoomFactor : 2,

		boardColors : {
        	        black: '#000',
               	 	white: '#fff',
                	red: '#f00',
               		light: '#E1DCB7',
                	green: '#008C00',
                	highlight : '#ff0'
	        }


	};

	for( var key in defaults ) {
		this[key] = defaults[key];
	}

	// Make all variables passed in parms availble via 'this'
	for( var key in parms ) {
		this[key] = parms[key];
	}

	this.elem = $(this.elem)[0];

	if( typeof(this.size) == 'undefined') {
		this.size = $(this.elem).width();
	}

	console.log('size: ' + this.size );


	this.edgeBoundaries = [];
	
	this.scroll = null;

	this.draw();
	//this.edges();
	this.addHandlers();	
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


DartBoard.prototype.draw = function() {
	var offset = $(this.elem).offset();

	console.log( "inserting into " + this.elem );
	this.paper = Raphael( this.elem, this.size, this.size );
	
	this.paper.setViewBox(0, 0, this.size, this.size, true);
	

	var radius = (this.size/2) * .72;
	this.center = this.size/2;

	this.outterBoard = this.paper.circle(
		this.center, this.center, this.size/2)
		.attr( {
			fill	: this.boardColors.black,
			stroke	: this.boardColors.white,
			'stroke-width' : 3 
		} );


	this.outterBoard.node.color = this.boardColors.black;
	this.outterBoard.node.thing = this.outterBoard;

	this.outterBoard.node.pointval = 0;
	this.outterBoard.node.shorthand = 'OUT';

	//this.logo = this.paper.image( 'http://www.leanmeantech.com/static/images/logo.png', center-(292/2), center*2 - 100, 296, 68); 

	this.slicePath = this.getSlicePath( 0, radius );
	this.doubleSlicePath = this.getSlicePath( radius*0.925, radius );
	this.tripleSlicePath = this.getSlicePath (radius *0.57, radius *0.65);

	//console.log(this.slicePath);

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
		slice.node.shorthand = value;
		doubleSlice.node.pointval = 2*value;
		doubleSlice.node.shorthand = 'D' + value;
		tripleSlice.node.pointval = 3*value;
		tripleSlice.node.shorthand = 'T' + value;	
	
		// Save a reference to the raphael object
		slice.node.thing = slice;
		doubleSlice.node.thing = doubleSlice;
		tripleSlice.node.thing  = tripleSlice;

	}
		
	this.singleBull = this.paper.circle( this.center, this.center, radius/8 )
				.attr( { fill: this.boardColors.green, stroke : this.boardColors.white, 'stroke-width' : 1 } );
	this.singleBull.node.color = this.boardColors.green;
	this.singleBull.node.thing = this.singleBull;
	this.singleBull.node.pointval = 25;
	this.singleBull.node.shorthand = 25;

	this.doubleBull = this.paper.circle( this.center, this.center, radius/16 )
				.attr( { fill: this.boardColors.red,  stroke : this.boardColors.white, 'stroke-width' : 1 } );

	this.doubleBull.node.pointval = 50;
	this.doubleBull.node.shorthand = 50;
	this.doubleBull.node.color = this.boardColors.red;
	this.doubleBull.node.thing = this.doubleBull;

};

DartBoard.prototype.edges = function() {
    // TODO: Regenerate on Resize...
    
    var size = this.size*0.20;
    var container = $("#board");
    var offset = container.offset();
    
    console.warn("Defining Actionable Edges " + size);
    
    this.edgeBoundaries = [];
    
    /*
     *  0   1   2
     *  7       3
     *  6   5   4
     */
        
    this.edgeBoundaries.push([
          [[offset.left, offset.top], [offset.left+size, offset.top+size]],
          [-1, -1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left + size, offset.top], [offset.left + container.width() - size , offset.top+size]],
          [0, -1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left + container.width() - size, offset.top], [offset.left + container.width(), offset.top+size]],
          [1, -1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left + container.width() - size, offset.top + size], [offset.left + container.width(), offset.top + container.height() - size]],
          [1, 0]
    ]);

    this.edgeBoundaries.push([
          [[offset.left + container.width() - size, offset.top + container.height() - size], [offset.left + container.width(), offset.top + container.height()]],
          [1, 1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left + size, offset.top + container.height() - size], [offset.left + container.width() - size, offset.top + container.height()]],
          [0, 1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left, offset.top + container.height() - size], [offset.left + size, offset.top + container.height()]],
          [-1, 1]
    ]);
    
    this.edgeBoundaries.push([
          [[offset.left, offset.top + size], [offset.left + size, offset.top + container.height() - size]],
          [-1, 0]
    ]);
    
//    for(i = 0; i < this.edgeBoundaries.length; i++) {
//        var edge = this.edgeBoundaries[i];
//                
//        var offsetX = edge[0][0][0] + 1;
//        var offsetY = edge[0][0][1] + 1;
//        
//        var width = edge[0][1][0] - offsetX - 1;
//        var height = edge[0][1][1] - offsetY - 1;
//                
//        $("body").append('<div class="edge_debug" style="background:none; color: red; font-size: 24px; border: 1px solid red; top: ' + offsetY + 'px; left: ' + offsetX + 'px; width: ' + width + 'px; height: ' + height + 'px; position: absolute;">'+ edge[1] +'</div>')
//    }
};


DartBoard.prototype.startScrolling = function(x, y) {
    this.stopScrolling();
    this.scroll = setInterval(function() {
        $("#board").prop("scrollLeft", $("#board").scrollLeft() + x*5);
        $("#board").prop("scrollTop", $("#board").scrollTop() + y*5);
    }, 50);    
};

DartBoard.prototype.stopScrolling = function() {
    if(this.scroll !== null) {
        clearInterval(this.scroll);
    }
};

DartBoard.prototype.onMove = function(x, y) {    
    var action = null;
    
    
    for(i = 0; i < this.edgeBoundaries.length; i++) {
        var edge = this.edgeBoundaries[i][0];
                
        if(x >= edge[0][0] && x <= edge[1][0] && y >= edge[0][1] && y <= edge[1][1]){
            action = this.edgeBoundaries[i][1];
            break;
        }
    }
    
    
    if(action) {
        this.startScrolling(action[0], action[1]);
    } else {
        this.stopScrolling()
    } 
};


DartBoard.prototype.addHandlers = function() {
	
	var board = this;


	/*
	if( typeof(this.onTouchDown) != 'undefined' ) {
		$(this.elem).bind( 'touchdown mousedown', function(e) {
			board.onTouchDown();
		});

	}
	*/

	if( this.zoomSelect || typeof(this.onTouchDown) != 'undefined' ){
		$(this.elem).bind('touchdown mousedown', function(e) {
			if( board.zoomSelect && board.zoomState != 'zoomed' ) {
				//board.paper.setSize( board.size * board.zoomFactor, board.size*board.zoomFactor );
				var point = pointFromEvent(e);
				var off = $(board.elem).offset();

				point.x -= off.left;
				point.y -= off.top;
				
				var xDelta = board.size/2 - point.x;
				var yDelta = board.size/2 - point.y;

				var xZoom = board.size/2 - ((board.size/2)/board.zoomFactor) - xDelta/2;
				var yZoom = board.size/2 - ((board.size/2)/board.zoomFactor) - yDelta/2; 

				console.log('xdelta: ' + xDelta + ' ydelta: ' + yDelta);


				console.log( point );
				board.paper.setViewBox(
					xZoom,
					yZoom,
					board.size/board.zoomFactor,
					board.size/board.zoomFactor, false );
				board.zoomState = 'zoomed';
			}			


		});
	}


	if( this.zoomSelect || typeof(this.onTouchUp) != 'undefined' ) {
		$(this.elem).bind('touchup mouseup', function(e) {
			if( board.zoomSelect && board.zoomState == 'zoomed' ) {
				board.paper.setViewBox( 0, 0, board.size, board.size, false ); 
				board.zoomState = 'normal';	
			}
		});

	}



	$('#' + this.elem.id + ' svg *').click( function(e) {
		if( typeof( board.onSelected ) === 'function' ) {
			if( typeof( this.pointval ) !== 'undefined' ) {
				board.onSelected( this.pointval, this.shorthand );
			}
		}
	});
	
	$('#' + this.elem.id + ' svg').bind('touchmove mousemove', function(e){
		e.preventDefault();
		
		var point = pointFromEvent(e);	
	
//		board.onMove(pageX, pageY);
	
	
		//console.log('x: ' + x + ' y: ' + y);

		var selected = board.paper.getElementByPoint( point.x, point.y );

		if( selected == board.selected ) {
			return;
		}
		if( typeof(board.selected) != 'undefined' && board.selected != null ) {
			board.selected.attr( { fill: board.selected.node.color } );
		}	


		if( null == selected ) {
			// left board
			if( typeof(board.onHover) != 'undefined' ) {
				board.onHover('');
			}
			return;
		}

		if( typeof(selected.node.pointval) == 'undefined' ) {
			return;
		}

		if( board.highlightSelection ) {
			selected.attr({ fill : board.boardColors.highlight });		
		}

		if( typeof(board.onHover) == 'function') {
			board.onHover( selected.node.pointval );
		}
		board.selected = selected;
	});


};

