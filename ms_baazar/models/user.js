var m = require('mongoose');
var Schema = m.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		index: {
			unique: true
		}
	}
});
var User = m.model('User', UserSchema);
module.exports = User;