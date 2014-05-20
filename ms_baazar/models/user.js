var m = require( 'mongoose' );
var Schema = m.Schema;
var Counter = require( './counter' );

var UserSchema = new Schema( {
    name: {
        type: String,
        trim: true
    },
    _id: {
        type: String,
        trim: true,
        lowercase: true,
        index: {
            unique: true
        }
    },
    img: {
        type: String,
        trim: true
    },
    authToken: {
        type: String,
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    id: false
} );

UserSchema.methods.exists = function ( cb ) {
    return this.model( 'User' )
        .findOne( {
            email: this.email
        }, cb );
}

UserSchema.statics.updateUser = function ( user, cb ) {
    return this.model( 'User' )
        .findOneAndUpdate( {
            email: doc.email
        }, user, {
            upsert: true
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

var User = m.model( 'user', UserSchema );
module.exports = User;
