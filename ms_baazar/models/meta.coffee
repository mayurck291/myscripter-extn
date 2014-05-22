mongoose    = require 'mongoose'
logger      = require '../utils/logger'

Schema      = mongoose.Schema

metaSchema = new Schema(
    _id : 
        type:Schema.Types.ObjectId
        ref :'recipe'
    users:
        type: [ {type:String,ref:'user'} ],
        default: [ ]        
    favs:
        type: [ {type:String,ref:'user'} ],
        default: [ ]
    forks:
        type:Number,
        default:0
    karma:
        type:[
                {   
                    user:{type:String,ref:'user',index:false},
                    karma:{type:Number,default:1},
                    body:{type:String,default:""},
                    _id:false,
                    id:false
                }
            ],
        default: [ ]
,
    id:false
)

metaSchema.set 'toJSON',virtuals: true

metaSchema
    .virtual('favc')
    .get ()-> this.favs.length

metaSchema
    .virtual('userc')
    .get ()-> this.users.length

metaSchema
    .virtual('karmac')
    .get ()->
        karmac = 0
        for k,i in this.karma
            karmac += k.karma

        if karmac is 0
            return 0
        else
            Math.ceil(karmac/i)



Meta = mongoose.model 'meta',metaSchema
module.exports = Meta