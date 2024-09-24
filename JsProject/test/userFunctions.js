const mongoose = require('mongoose');
const User = require('./Models/User');
const Tool = require('./Models/Tool');
const Material = require('./Models/Material');

// Create a new user
async function addUser(name, age, email) {
    const user = new User({ name, age, email });
    try {
        await user.save();
        console.log('User added:', user);
    } catch (error) {
        console.error('Error adding user:', error.message);
    }
}

// Find a user by name
async function findUserByName(userName) {
    const user = await User.findOne({ name: userName });

    if (!user) {
        throw new Error('User not found.');
    }

    return user;
}

// Update a user by name
async function updateUser(userName, updatedFields) {
    const user = await findUserByName(userName);

    Object.assign(user, updatedFields);
    await user.save();

    console.log('User updated:', user);
}

// Delete a user by name
async function deleteUser(userName) {
    const result = await User.deleteOne({ name: userName });

    if (result.deletedCount === 0) {
        throw new Error('No user found with that name.');
    }

    console.log('User deleted:', userName);
}

// List all users
async function listAllUsers() {
    const users = await User.find({});
    console.log('All users:', users);
}

// Use an item and add to user's used items list
async function useItem(userName, itemName, number) {
    const user = await findUserByName(userName);
    await user.useItem(itemName, number); // Using the user's method
    await user.save(); // Save the user to persist changes
    console.log(`${user.name} used the item: ${itemName}`);
}

// Get all tools used by a user
async function getUsedItems(userName) {
    const user = await findUserByName(userName);
    const usedItems = await user.getUsedItems(); // Используйте метод getUsedItems
    console.log(`${user.name}'s used tools:`, usedItems);
};

async function buildSmth(currUser, itemName, itemAmount){
let user = await User.findOne({name: currUser});
if (!user) {
    throw new Error('No user found with that name.');
}
user.buildSomething(itemName, itemAmount)
.then(() => {
    console.log('Build process completed successfully.');
})
.catch((err) => {
    console.log('Error:', err.message);
});
}

module.exports = {
    addUser,
    findUserByName,
    updateUser,
    deleteUser,
    listAllUsers,
    useItem,
    getUsedItems,
    buildSmth
};
