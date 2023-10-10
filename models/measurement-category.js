const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeasurementCategorySchema = new Schema({
    ingredient: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    }
});

module.exports = mongoose.model('MeasurementCategory', MeasurementCategorySchema);