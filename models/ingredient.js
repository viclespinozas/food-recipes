const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    ],
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    processType: {
        type: Schema.Types.ObjectId,
        ref: 'ProcessType'
    },
    measurementCategory: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementCategory'
    }
});

IngredientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ingredient', IngredientSchema);