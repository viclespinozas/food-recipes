const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Categories = require('./category');
const ProcessTypes = require('./process-type');
const mongoosePaginate = require('mongoose-paginate');

const IngredientSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    image: [
        {
            url: String, public_id: String
        }
    ]
});

IngredientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ingredient', IngredientSchema);