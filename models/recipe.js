const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ingredient = require('./ingredient');
const mongoosePaginate = require('mongoose-paginate');

const RecipeSchema = new Schema({
    title: String,
    preparation: String,
    image: [
        {
            url: String, public_id: String
        }
    ],
    ingredients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ]
});

RecipeSchema.pre('remove', async function(){
   await Ingredient.remove({
       _id: {
           $in: this.ingredients
       }
   });
});

RecipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', RecipeSchema);