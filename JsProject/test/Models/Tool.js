const mongoose = require('mongoose');
const Item = require('./Item');

// Tool Schema
const toolSchema = new mongoose.Schema({
    usage: { type: Number, required: true, min: 0, max: 100 }, 
    condition: { type: Number, required: true, min: 0, max: 100 },
    borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Tool Methods
toolSchema.methods.useTool = async function(userName) {
    const user = await mongoose.model('User').findOne({ name: userName });

    if (!user) {
        throw new Error('User not found.');
    }

    if (this.condition > 15) {
        this.condition -= 10;
        this.borrowedBy.push(user._id);

        // Add tool to user's used items
        if (!user.usedItems.includes(this.name)) {
            user.usedItems.push(this.name);
        }

        await this.save();
        await user.save();
        return `Tool ${this.name} used by ${user.name};`;
    } else {
        throw new Error('This tool cannot be used due to its condition.');
    }
};

toolSchema.methods.fixTool = async function() {
    this.condition = Math.min(this.condition + 20, 100);
    await this.save();
};

// Tool Model
const Tool = Item.discriminator('Tool', toolSchema);

module.exports = Tool;
