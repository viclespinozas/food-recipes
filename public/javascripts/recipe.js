function addNewIngredient() {
    const elementsList = [
        {'name': 'weight', 'type': 'input'},
        {'name': 'measurement', 'type': 'select'},
        {'name': 'ingredient', 'type': 'select'}
    ];
    hasListIngredients();

    if (!hasListIngredients()) {
        addIngredientToList(elementsList);
    } else {
        let ingredientsList = getIngredientsList();
        if (checkIngredientInList(ingredientsList)) {
            alert("El ingrediente ya está en la lista!");
        } else {
            addIngredientToList(elementsList);
        }
    }
}

function hasListIngredients() {
    return !!document.getElementById('ingredientsMeasurements').value;
}

function insertNewRow() {
    let table = document.getElementById('ingredientsContainer').getElementsByTagName('tbody')[0];
    return table.insertRow();
}

function insertNewCell(tableRow, cellPosition) {
    return tableRow.insertCell(cellPosition);
}

function insertNewElementInCell(tableRowCell, newElement, elementType, elementName) {
    let cellElement = document.createElement(newElement);
    if (elementType == 'input') {
        cellElement.textContent = document.getElementById(elementName).value;
    } else if (elementType == 'select') {
        cellElement.textContent = ( document.getElementById(elementName).selectedIndex != -1 ) ?
            document.getElementById(elementName).options[
                document.getElementById(elementName).selectedIndex
            ].text : null;
    }

    tableRowCell.appendChild(cellElement);
}

function insertNewDeleteActionButtonInCell(tableRow, cellPosition, cellElement) {
    let cell = tableRow.insertCell(cellPosition);
    let removeButton = document.createElement(cellElement);
    let removeData = [];
    let removeDataChild = {
        ingredient: document.getElementById('ingredient').value,
        measurement: document.getElementById('measurement').value,
        weight: document.getElementById('weight').value
    }
    removeData.push(removeDataChild);
    removeButton.setAttribute('onclick', 'removeIngredient(this, '+JSON.stringify(removeData)+')');
    let removeIcon = document.createElement('i');
    removeIcon.className = 'fas fa-trash text-danger';

    removeButton.appendChild(removeIcon);
    cell.appendChild(removeButton);
}

function addIngredientToList(elementsList) {
    let tableRow = insertNewRow();
    for (const [index, element] of Object.entries(elementsList)) {
        let tableRowCell = insertNewCell(tableRow, index);
        insertNewElementInCell(tableRowCell, 'span', element.type, element.name);
    }
    insertNewDeleteActionButtonInCell(tableRow, tableRow.cells.length, 'span');
    updateIngredientsList();
}

function updateIngredientsList() {
    let ingredientsList = document.getElementById('ingredientsMeasurements').value;
    let dataParent = [];
    if (ingredientsList) {
        ingredientsList = JSON.parse(ingredientsList);
        dataParent = ingredientsList;

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

function getIngredientsList() {
    return JSON.parse(document.getElementById('ingredientsMeasurements').value);
}

function checkIngredientInList(ingredientsList) {
    const itemToFind = (item) =>
        (item['ingredient'] == document.getElementById('ingredient').value) &&
        (item['measurement'] == document.getElementById('measurement').value);
    const itemIndex = ingredientsList.findIndex(itemToFind);

    return itemIndex > -1;
}

function removeIngredient(tableRow, ingredientData) {
    const row = tableRow.parentNode.parentNode;
    row.parentNode.removeChild(row);

    let measurement = ingredientData[0]['measurement'];
    let ingredient = ingredientData[0]['ingredient'];
    let weight = ingredientData[0]['weight'];

    let ingredientsMeasurements = JSON.parse(document.getElementById('ingredientsMeasurements').value);
    const itemToFind = (item) => (item['ingredient'] == ingredient) && (item['measurement'] == measurement) && (item['weight'] == weight);
    const itemIndex = ingredientsMeasurements.findIndex(itemToFind);
    if (itemIndex > -1) {
        ingredientsMeasurements.splice(itemIndex, 1);
    }
    document.getElementById('ingredientsMeasurements').value = JSON.stringify(ingredientsMeasurements);
}
