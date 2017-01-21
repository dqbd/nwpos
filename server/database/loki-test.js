const loki = require("lokijs")

let db = new loki("db.json", {
	autoload: true,
	autosave: true,
	autoloadCallback: () => {
		let users = db.getCollection("users")
		if (users === null) {
			console.log("creating new database")
			users = db.addCollection("users")
		}

		var odin = users.insert( { name : 'odin', email: 'odin.soap@lokijs.org', age: 38 } )
		var thor = users.insert( { name : 'thor', email : 'thor.soap@lokijs.org', age: 25 } )
		var stan = users.insert( { name : 'stan', email : 'stan.soap@lokijs.org', age: 29 } )
		var oliver = users.insert( { name : 'oliver', email : 'oliver.soap@lokijs.org', age: 31 } )
		var hector = users.insert( { name : 'hector', email : 'hector.soap@lokijs.org', age: 15} )
		var achilles = users.insert( { name : 'achilles', email : 'achilles.soap@lokijs.org', age: 31 } )

		var dv = users.addDynamicView('a_complex_view')
		// console.log(dv.data())

		db.close()
	}
})
