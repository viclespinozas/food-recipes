const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ingredient = require('./ingredient');
const IngredientMeasurement = require('./ingredient-measurement');
const mongoosePaginate = require('mongoose-paginate');

const RecipeSchema = new Schema({
    title: String,
    preparation: String,
    image: [
        {
            url: String, public_id: String
        }
    ],
    ingredientsMeasurements: [
        {
            type: Schema.Types.ObjectId,
            ref: 'IngredientMeasurement'
        }
    ]
});

RecipeSchema.pre('remove', async function(){
   await IngredientMeasurement.remove({
       _id: {
           $in: this.ingredientsMeasurements
       }
   });
});

RecipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', RecipeSchema);