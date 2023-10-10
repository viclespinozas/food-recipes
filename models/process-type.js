const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProcessTypeSchema = new Schema ({
    title: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProcessType', ProcessTypeSchema);