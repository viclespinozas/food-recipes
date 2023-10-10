const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IngredientMeasurementConversion = require('./ingredient-measurement-conversions');
const mongoosePaginate = require('mongoose-paginate');

const IngredientMeasurementSchema = new Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    ingredient: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient'
    },
    measurement: {
        type: Schema.Types.ObjectId,
        ref: 'Measurement'
    },
    weight: {
        type: String
    },
    group: {
        type: String
    },
    ingredientMeasurementConversion: {
        type: Schema.Types.ObjectId,
        ref: "IngredientMeasurementConversion"
    }
});

IngredientMeasurementSchema.pre('remove', async function() {
    await IngredientMeasurementConversion.remove({
        _id: {
            $in: this.ingredientMeasurementConversion
        }
    });
});

IngredientMeasurementSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('IngredientMeasurement', IngredientMeasurementSchema);
