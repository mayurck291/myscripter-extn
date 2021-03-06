Meta = require  './meta' 
mongoose = require  'mongoose' 
Schema = mongoose.Schema;

RecipeSchema = new Schema(
    title: String
    desc: String
    author:
        type: String
        trim: true
        ref: 'user'
        lowercase: true
    ingredients:
        name: String
        url: String
        external:
            js: [ String ]
            css: [ String ]
        js: String
        css: String
        enabled: Boolean,
        autoApply: Boolean
    imgs:
        type: [ String ],
        'default': [ ]
    comments:
        type:[
            {
            body: String,
            user: 
                type: String
                trim: true
                ref: 'user'
                lowercase: true,
            date: 
                type:Date
                default:Date.now
            }
        ],
        default:[]
    createdAt:
        type: Date,
        'default': Date.now
,
    id:false
)
Recipe = mongoose.model 'recipe',RecipeSchema
module.exports = Recipe