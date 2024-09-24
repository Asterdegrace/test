const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    usedItems: [{ type: String }] 
});

// User Methods
userSchema.methods.useItem = async function(itemName, number) {
    const item = await mongoose.model('Item').findOne({ name: itemName });

    if (!item) {
        throw new Error('Item not found.');
    } else if (number > item.amount) {
        throw new Error(`There is less ${item.name} than that.`);
    }

    item.amount -= number;
    await item.save();

    if (!item.usedBy) {
        item.usedBy = [];
    }
    item.usedBy.push(this.name);
    await item.save();

    return `User ${this.name} used ${number} of ${item.name}.`;
};

userSchema.methods.getUsedItems = async function() {
    // Return the list of items used by this user
    return this.usedItems;
};

userSchema.methods.buildSomething = async function(itemsNames, itemsAmounts) {
    if (itemsNames.length !== itemsAmounts.length) {
        throw new Error('The number of item names and amounts must match.');
    }

    const toolsUsed = [];
    const materialsUsed = [];

    for (let i = 0; i < itemsNames.length; i++) {
        const itemName = itemsNames[i];
        const itemAmount = itemsAmounts[i];

        const item = await mongoose.model('Item').findOne({ name: itemName });

        if (!item) {
            throw new Error(`Item ${itemName} not found in the database.`);
        }

        if (itemAmount > item.amount) {
            throw new Error(`Not enough of ${itemName} available.`);
        }

        if (item.itemType === 'Tool') {
            const tool = await mongoose.model('Tool').findOne({ name: itemName });
            await tool.useTool(this.name);
            
            // Add user to borrowedBy array
            if (!tool.borrowedBy.includes(this._id)) {
                tool.borrowedBy.push(this._id);
            }
            
            await tool.save();
            
            toolsUsed.push(tool.name);
        } else {
            item.amount -= itemAmount;
            await item.save();
            materialsUsed.push({ name: item.name, amount: itemAmount });
        }
    }

    console.log(`${this.name} built something using tools:`, toolsUsed, 'and materials:', materialsUsed);
};


// User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
