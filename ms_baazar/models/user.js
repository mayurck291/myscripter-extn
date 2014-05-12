var m = require( 'mongoose' );
var Schema = m.Schema;
var Counter = require( './counters' );

var UserSchema = new Schema( {
    // _id: Number,
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
} );

UserSchema.methods.exists = function ( cb ) {
    return this.model( 'User' )
        .findOne( {
            email: this.email
        }, cb );
}

UserSchema.statics.insert = function ( doc, cb ) {
    return this.model( 'User' )
        .findOneAndUpdate( {
            email: doc.email
        }, doc, {
            upsert: true
        }, cb );
}

// UserSchema.methods.save = function ( cb ) {

//     Counter.increment()
// }
// console.log( UserSchema );

// user = new User( {
//     name: "parin kataria",
//     email: "parin2092@gmail.com"
// } );

var User = m.model( 'users', UserSchema );
module.exports = User;
