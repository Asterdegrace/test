const mongoose = require('mongoose');
const Material = require('./Models/Material');

// Create a new material
async function addMaterial(name, amount, cost, supplier, quality) {
    // Validate material name
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid material name: name must be a non-empty string.');
    }
    
    // Validate numeric inputs
    if (!Number.isInteger(amount) || amount < 0) {
        throw new Error('Invalid amount: must be a non-negative integer.');
    }
    if (typeof cost !== 'number' || cost < 0) {
        throw new Error('Invalid cost: must be a non-negative number.');
    }

    const material = new Material({ name, amount, cost, supplier, quality });
    await material.save();
    console.log('Material added:', material);
}

// Find a material by name
async function findMaterialByName(materialName) {
    const material = await Material.findOne({ name: materialName });

    if (!material) {
        throw new Error('Material not found.');
    }

    return material;
}

// Update a material by name
async function updateMaterial(materialName, updatedFields) {
    const material = await findMaterialByName(materialName);

    Object.assign(material, updatedFields);
    await material.save();

    console.log('Material updated:', material);
}

// Delete a material by name
async function deleteMaterial(materialName) {
    const result = await Material.deleteOne({ name: materialName });

    if (result.deletedCount === 0) {
        throw new Error('No material found with that name.');
    }

    console.log('Material deleted:', materialName);
}

// List all materials
async function listAllMaterials() {
    const materials = await Material.find({});
    console.log('All materials:', materials);
}

// Use material
async function useMaterial(materialName, amount) {
    const material = await findMaterialByName(materialName);
    await material.use(amount); // Вызов метода use
    await material.save();
    console.log('Material used:', material);
}



module.exports = {
    addMaterial,
    findMaterialByName,
    updateMaterial,
    deleteMaterial,
    listAllMaterials,
    useMaterial,
};

/*// Calculate worth of an Material
async function calculateWorth(itemName) {
    const material = await findItemByName(itemName);
    return material.worth();
};*/
