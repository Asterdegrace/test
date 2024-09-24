const mongoose = require('mongoose');

// Item Schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 }, // Ensure amount is non-negative
    cost: { type: Number, required: true, min: 0 } // Ensure cost is non-negative
}, { discriminatorKey: 'itemType' });

// Item Methods
itemSchema.methods.worth = function() {
    return this.amount * this.cost;
};

itemSchema.methods.newArrival = function(amount) {
    if (amount < 0) {
        throw new Error('Amount must be non-negative.');
    }
    this.amount += amount;
};

// Item Model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
