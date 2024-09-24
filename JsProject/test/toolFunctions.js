const mongoose = require('mongoose');
const Tool = require('./Models/Tool');

// Create a new tool
async function addTool(name, amount, cost, usage, condition) {
    // Validate tool name
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid tool name: name must be a non-empty string.');
    }

    // Validate numeric inputs
    if (!Number.isInteger(amount) || amount < 0) {
        throw new Error('Invalid amount: must be a non-negative integer.');
    }
    if (typeof cost !== 'number' || cost < 0) {
        throw new Error('Invalid cost: must be a non-negative number.');
    }
    if (typeof usage !== 'number' || usage < 0 || usage > 100) {
        throw new Error('Invalid usage: must be a number between 0 and 100.');
    }
    if (typeof condition !== 'number' || condition < 0 || condition > 100) {
        throw new Error('Invalid condition: must be a number between 0 and 100.');
    }

    const tool = new Tool({ name, amount, cost, usage, condition });
    await tool.save();
    console.log('Tool added:', tool);
}

// Find a tool by name
async function findToolByName(toolName) {
    const tool = await Tool.findOne({ name: toolName });

    if (!tool) {
        throw new Error('Tool not found.');
    }

    return tool;
}

// Update a tool by name
async function updateTool(toolName, updatedFields) {
    const tool = await findToolByName(toolName);

    Object.assign(tool, updatedFields);
    await tool.save();

    console.log('Tool updated:', tool);
}

// Delete a tool by name
async function deleteTool(toolName) {
    const result = await Tool.deleteOne({ name: toolName });

    if (result.deletedCount === 0) {
        throw new Error('No tool found with that name.');
    }

    console.log('Tool deleted:', toolName);
}

// List all tools
async function listAllTools() {
    const tools = await Tool.find({});
    console.log('All tools:', tools);
}

// Use a tool
async function useTool(toolName, userName) {
    const tool = await findToolByName(toolName);
    await tool.useTool(userName); // Передаем userName в метод
    await tool.save();
    console.log('Tool used:', tool);
}

// Fix a tool
async function fixTool(toolName) {
    const tool = await findToolByName(toolName);
    await tool.fixTool(); // Вызов метода fixTool
    await tool.save();
    console.log('Tool fixed:', tool);
}

module.exports = {
    addTool,
    findToolByName,
    updateTool,
    deleteTool,
    listAllTools,
    useTool,
    fixTool,
};
