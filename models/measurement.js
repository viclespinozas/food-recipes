const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
   title: {
       type: String,
       required: true
   }
});

module.exports = mongoose.model('Measurement', MeasurementSchema);