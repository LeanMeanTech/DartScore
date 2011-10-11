

function getDB() {
	if( 'undefined' == typeof(DB) ) {
		DB = new DBInterface();
	}

	return DB;

}


var DBInterface = function() {
	// http://developer.apple.com/library/safari/#documentation/iPhone/Conceptual/SafariJSDatabaseGuide/UsingtheJavascriptDatabase/UsingtheJavascriptDatabase.html

	var shortName = 'dartscore';
        var version = '1.0';
        var displayName = 'DartScore from LeanMeanTech';
        var maxSize = 1048576; // in bytes

        this._db = openDatabase(shortName, version, displayName, maxSize);
	this.createSchema();

	
};

function nullDataHandler(transaction, results) { }
function errorHandler( t, error ) {
	return false;
}

DBInterface.prototype.createSchema = function() {
	this._db.transaction( 
		function(t) {
			t.executeSql('CREATE TABLE player(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);', [], nullDataHandler, errorHandler);

		}

	);

};


DBInterface.prototype.getPlayers = function(callback) {
	this._db.transaction(
		function(t) {
			t.executeSql( 'SELECT * from player;', [],
				function(t, results) {
					var players = [];

					for( var i = 0; i < results.rows.length; i++ ) {
						var row = results.rows.item(i);
						players.push( new Player(row['id'], row['name']) ); 					
					}

					callback(players);				
				},
				function(t, error){
					console.log(error);
					callback(null);
				}
			);

		}
	);

}

DBInterface.prototype.addPlayer = function( player, callback ){	
	console.log('addplayer: ' + player);
	this._db.transaction(
		function(t) {
			t.executeSql( 'INSERT into player (name) VALUES (?)', [ player ],
			function(t, results) {
				callback();
			},
			function(t, error) {
				console.warn('error inserting @ addPlayer');
			});
		}
	);
			
}

