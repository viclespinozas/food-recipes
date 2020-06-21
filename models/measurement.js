const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
   codeName: {
       type: String,
       required: true
   },
    displayName: {
       type: String
    }
});

module.exports = mongoose.model('Measurement', MeasurementSchema);