mongoose    = require 'mongoose'
logger      = require '../utils/logger'

Schema      = mongoose.Schema

metaSchema = new Schema
    _id : 
        type:Schema.Types.ObjectId
        ref :'recipe'
    users:
        type: [ {type:String,ref:'user'} ],
        default: [ ]
    ,        
    favs:
        type: [ {type:String,ref:'user'} ],
        default: [ ]
    ,
    karma:
        type:[{_id:{type:String,ref:'user'},karma:Number}],
        default: [ ]


metaSchema
    .virtual('name')
    .get ()-> this.favs
Meta = mongoose.model 'meta',metaSchema
module.exports = Meta