const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Categories = require('./category');
const ProcessTypes = require('./process-type');
const MeasurementCategory = require('./measurement-category');
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
    processTypes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProcessType'
        }
    ],
    measurementCategory: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementCategory'
    }
});

IngredientSchema.pre('remove', async function(){
   await Categories.remove({
       _id: {
           $in: this.categories
       }
   });
   await ProcessTypes.remove({
       _id: {
           $in: this.processTypes
       }
   });
   await MeasurementCategory.remove({
       _id: {
           $in: this.measurementCategory
       }
   })
});

IngredientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ingredient', IngredientSchema);