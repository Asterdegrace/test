const mongoose = require('mongoose');
const Item = require('./Models/Item');

// Create a new item
async function addItem(name, amount, cost) {
    const item = new Item({ name, amount, cost });
    await item.save();
    console.log('Item added:', item);
}

// Find an item by name
async function findItemByName(itemName) {
    const item = await Item.findOne({ name: itemName });

    if (!item) {
        throw new Error('Item not found.');
    }

    return item;
}

// Update an item by name
async function updateItem(itemName, updatedFields) {
    const item = await findItemByName(itemName);
    
    Object.assign(item, updatedFields);
    await item.save();

    console.log('Item updated:', item);
}

// Delete an item by name
async function deleteItem(itemName) {
    const result = await Item.deleteOne({ name: itemName });

    if (result.deletedCount === 0) {
        throw new Error('No item found with that name.');
    }

    console.log('Item deleted:', itemName);
}

// List all items
async function listAllItems() {
    const items = await Item.find({});
    console.log('All items:', items);
}

// Calculate worth of an item
async function calculateWorth(itemName) {
    const item = await findItemByName(itemName);
    return item.worth();
}

// Add new arrival to an item
async function addNewArrival(itemName, amountToAdd) {
    const item = await findItemByName(itemName);
    item.newArrival(amountToAdd);
    await item.save();
    console.log('New arrival added to item:', item);
}

module.exports = {
    addItem,
    findItemByName,
    updateItem,
    deleteItem,
    listAllItems,
    calculateWorth,
    addNewArrival,
};
