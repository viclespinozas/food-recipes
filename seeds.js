const Ingredient = require('./models/ingredient');
const ingredients = require('./ingredients');

async function seedIngredients() {
    await Ingredient.deleteMany({});
    for(const ingredient of ingredients) {
        let newIngredient = new Ingredient(ingredient);
        await newIngredient.save();
    }
    console.log('Ingredients imported sucessfully!');
}

module.exports = seedIngredients;