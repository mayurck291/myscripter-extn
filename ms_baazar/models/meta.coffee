mongoose    = require 'mongoose'

Schema      = mongoose.Schema

metaSchema = new Schema(
    _id : 
        type:Schema.Types.ObjectId
        ref :'Recipe'
    users:
        type: [ String ],
        default: [ ]
    ,        
    favs:
        type: [ String ],
        default: [ ]
    ,
    karma:
        value:
            type: Number,
            default: 8
        users:
            type: [ String ],
            default: [ ]
    )

Meta = mongoose.model 'meta',metaSchema
module.exports = Meta