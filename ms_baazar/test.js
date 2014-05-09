var mongoose = require( 'mongoose' );
module.exports = mongoose.model( 'recipes', {
    _meta: String,
    _id: Number,
    name: String,
    desc: String,
    comments: Array,
    rating: Array,
} )
