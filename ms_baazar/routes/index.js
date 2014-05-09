var Recipe = require('../models/recipe');
var User = require('../models/user');

exports.index = function (req, res) {
	res.render('index', {
		title: 'Express'
	})
};


exports.saveRecipe = function (req, res) {
	var params = req.body;
	console.log(params);
	var recipe = new Recipe(params);
	console.log(recipe);
	recipe.save(function (err) {
		if (!err) {
			res.json({
				status: "success",
				msg: "Succesfully saved"
			});
			console.log("Googly moogly mush....na na naa nannnnaaaa....")
		} else {
			res.json({
				status: "error",
				msg: "Succesfully saved"
			});
			console.log("Byte me...!!", err);
		}
	})
}

exports.getRecipes = function (req, res) {
	Recipe.find()
		.limit(10)
		.exec(function (err, recipes) {
			res.json(recipes);
		})
}

exports.saveUser = function (req, res) {
	var params = req.body;
	console.log(params);
	var user = new User(params);
	user.save(function (err) {
		if (!err) {
			res.json({
				status: "success",
				msg: "Succesfully saved"
			});
			console.log("Googly moogly mush....na na naa nannnnaaaa....")
		} else {
			res.json({
				status: "error",
				msg: "Succesfully saved"
			});
			console.log("Byte me...!!");
		}
	})
}