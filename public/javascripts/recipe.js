function removeIngredient(btn, data) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);

    let measurement = data[0]['measurement'];
    let ingredient = data[0]['ingredient'];
    let weight = data[0]['weight'];

    let ingredientsMeasurements = JSON.parse(document.getElementById('ingredientsMeasurements').value);
    const itemToFind = (item) => (item['ingredient'] == ingredient) && (item['measurement'] == measurement) && (item['weight'] == weight);
    const itemIndex = ingredientsMeasurements.findIndex(itemToFind);
    if (itemIndex > -1) {
        ingredientsMeasurements.splice(itemIndex, 1);
    }
    document.getElementById('ingredientsMeasurements').value = JSON.stringify(ingredientsMeasurements);
}

function insRow() {
    let table = document.getElementById('ingredientsContainer').getElementsByTagName('tbody')[0];
    let tr = table.insertRow();
    let measurement = document.getElementById('measurement');
    let ingredient = document.getElementById('ingredient');
    let weight = document.getElementById('weight');

    let weightCell = tr.insertCell(0);
    let measurementCell = tr.insertCell(1);
    let ingredientCell = tr.insertCell(2);
    let removeButtonCell = tr.insertCell(3);

    /* WEIGHT */
    let weightCellValue = document.createElement('span');
    weightCellValue.id = 'ingredientsMeasurements_weight_' + table.rows.length;
    weightCellValue.textContent = weight.value;

    weightCell.appendChild(weightCellValue);

    /* MEASUREMENT */
    let measurementCellValue = document.createElement('span');
    measurementCellValue.id = 'ingredientsMeasurements_measurement_' + table.rows.length;
    measurementCellValue.textContent = ( measurement.selectedIndex != -1 ) ? measurement.options[measurement.selectedIndex].text : null;

    measurementCell.appendChild(measurementCellValue);

    /* INGREDIENT */
    let ingredientCellValue = document.createElement('span');
    ingredientCellValue.id = 'ingredientsMeasurements_ingredient_' + table.rows.length;
    ingredientCellValue.textContent = ( ingredient.selectedIndex != -1 ) ? ingredient.options[ingredient.selectedIndex].text : null;

    ingredientCell.appendChild(ingredientCellValue);

    /* DELETE BUTTON */
    let removeButton = document.createElement('span');
    let removeData = [];
    let removeDataChild = {
        ingredient: ingredient.value,
        measurement: measurement.value,
        weight: weight.value
    }
    removeData.push(removeDataChild);
    removeButton.setAttribute('onclick', 'removeIngredient(this, '+JSON.stringify(removeData)+')');
    let removeIcon = document.createElement('i');
    removeIcon.className = 'fas fa-trash text-danger';

    removeButton.appendChild(removeIcon);
    removeButtonCell.appendChild(removeButton);

    /* ASSIGN OBJECT AND RETRIEVE IT TO SHOW PROPER NAMES */
    let ingredientsMeasurements = document.getElementById('ingredientsMeasurements').value;
    let dataParent = [];
    if (ingredientsMeasurements) {
        ingredientsMeasurements = JSON.parse(ingredientsMeasurements);
        dataParent = ingredientsMeasurements;

        let dataChild = {
            ingredient: ingredient.value,
            measurement: measurement.value,
            weight: weight.value
        }

        dataParent.push(dataChild);
    } else {
        let dataChild = {
            ingredient: ingredient.value,
            measurement: measurement.value,
            weight: weight.value
        }

        dataParent.push(dataChild);
    }

    document.getElementById('ingredientsMeasurements').value = JSON.stringify(dataParent);
}