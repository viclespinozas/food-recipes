const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ingredient = require('./ingredient');
const Measurement = require('./measurement');
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
    }
});

IngredientMeasurementSchema.pre('remove', async function() {
    await Ingredient.remove({
        _id: {
            $in: this.ingredient
        }
    });
    await Measurement.remove({
       _id: {
           $in: this.measurement
       }
    });
});

IngredientMeasurementSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('IngredientMeasurement', IngredientMeasurementSchema);
