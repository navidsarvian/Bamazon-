// dependenciesn npm
var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');

//starting connection to my database below

var connectionCommence = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "Bamazon"
});

// connection to check if databse is being activated
connectionCommence.connect(function(err) {
	if (err){
		console.log(err);
		return;
	}
	console.log('Connection to Bamazon... Check!');
});

connectionCommence.query('SELECT * from Products', function(err, rows){
	//prints each product
	for (var i = 0; i < rows.length; i++) {
		console.log(rows[i].itemID + "\t" + rows[i].productName + "\t\t" + rows[i].price);
		rows[i]
	}

	//calling back the userInputBuy function
	userInputBuy();
});

//created userinputbuy function
function userInputBuy(){

	// inquire packagee to prompt out questions to the user of the app
	inquirer.prompt([
	{
		name: "id",
		type: "input",
		message: "Provide product ID for the item you'd like to buy:",
		validate: function(value){
			// validation for answer not a number
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log("\nNot a valid ID,p rovide the product ID for item you'd like to purchase: ");
				return false;
			}
		}
	},

	{
		name: "quantity",
		type: "input",
		message: "How many do you want to buy?:",
		validate: function(value){
			//function validation
			if (isNaN(value) === false) {
				return true;
			} else {
				console.log("\n Please enter a correct quantity:");
				return false;
			}
		}
	}
	// .then is running an asyncrhonous function
	]).then(function(answer){

		//query
		connectionCommence.query("SELECT * FROM Products WHERE ?", [{itemID: answer.id}], function(err, data){
			if (err) throw err;
			if (data[0].stockQuantity < answer.quantity) {
			console.log("Insufficient Quantity \n");
			console.log("Please pick another product ID or try a lower quantity \n");

			// calling back userInputBuy to run through my function again if they decide to try again
			userInputBuy();
			} else {
				//console.log('made it');

				//create new var for new quantity which equals the data stock original quantity minus the answer
				var newQuantity = data[0].stockQuantity - answer.quantity;
				var totalCost = data[0].price * answer.id;

				connectionCommence.query('UPDATE products SET stockQuantity = ? WHERE itemID = ?', [newQuantity, answer.id], function(err, results){
					if (err) {
						throw err;
					} else{
						// check if quant is updated
						console.log('new quantity: ' + newQuantity);
						connectionCommence.end();
					}
				});

			}
		});
	});

};
