var m = require('mongoose');
var Schema = m.Schema;

var CountersSchema = new Schema({
	_id: String,
	next: {
		type: Number,
		default: 0
	}
});

CountersSchema.static.increment = function (counter, callback) {
	return this.collection.findAndModify({
		_id: counter
	}, [], {
		$inc: {
			next: 1
		}
	}, callback);
};



var Counters = m.model('Counters', CountersSchema);

module.exports = Counters;


// Counters.increment('recipes', function (err, result) {
// 	if (err) {
// 		throw err;
// 	} else {
// 		next = result.next;
// 	};
// });