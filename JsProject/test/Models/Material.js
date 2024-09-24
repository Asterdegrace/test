const mongoose = require('mongoose');
const Item = require('./Item');

// Material Schema
const materialSchema = new mongoose.Schema({
    supplier: { type: String, required: true },
    quality: { type: String, required: true },
});

// Material Methods
materialSchema.methods.use = async function(number) {
    if (number < 0) {
        throw new Error('Cannot use a negative amount of material.');
    }
    if (number > this.amount) {
        throw new Error(`Not enough ${this.name} available to use.`);
    }

    this.amount -= number;
    await this.save(); // Save the updated material
};

// Material Model
const Material = Item.discriminator('Material', materialSchema);

module.exports = Material;
