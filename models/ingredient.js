const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const IngredientSchema = new Schema ({
    title: String,
    image: [
        {
            url: String, public_id: String
        }
    ]
});

IngredientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ingredient', IngredientSchema);