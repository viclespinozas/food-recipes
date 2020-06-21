const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientMeasurementConversionSchema = new Schema({
    grams: {
        type: mongoose.Decimal128
    },
    milliliters: {
        type: mongoose.Decimal128
    },
    cup: {
        type: String
    },
    pound: {
        type: mongoose.Decimal128
    },
    ounce: {
        type: mongoose.Decimal128
    },
    tablespoon: {
        type: String
    },
    teaspoonful: {
        type: String
    },
    ingredientMeasurement: {
        type: Schema.Types.ObjectId,
        ref: 'IngredientMeasurement'
    }
});

module.exports = mongoose.model('IngredientMeasurementConversion', IngredientMeasurementConversionSchema);