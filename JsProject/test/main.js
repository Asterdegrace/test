const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./Models/User');
const Material = require('./Models/Material');
const Tool = require('./Models/Tool');
const Item = require('./Models/Item');
const {addItem,
    findItemByName,
    updateItem,
    deleteItem,
    listAllItems,
    calculateWorth,
    addNewArrival,
} = require('./itemFunctions');
const {addTool,
    findToolByName,
    updateTool,
    deleteTool,
    listAllTools,
    useTool,
    fixTool,
} = require('./toolFunctions');
const {addMaterial,
    findMaterialByName,
    updateMaterial,
    deleteMaterial,
    listAllMaterials,
    useMaterial,
} = require('./materialFunctions');
const {
    addUser,
    findUserByName,
    updateUser,
    deleteUser,
    listAllUsers,
    useItem,
    getUsedItems,
    buildSmth
} = require('./userFunctions'); // Importing user functions

// Connect to MongoDB
mongoose.connect('mongodb+srv://AnnaEnkin:12345@cluster.kgo3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
    .then(() => {
        console.log('Connected to MongoDB');
        mainMenu(); // Call main menu after successful connection
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the program on connection error
    })


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user input
async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Main menu
async function mainMenu() {
    while (true) {
        console.log('\nMain Menu');
        console.log('1. User Actions');
        console.log('2. Item Actions');
        console.log('3. Material Actions');
        console.log('4. Tool Actions');
        console.log('5. Exit');

        const choice = await promptUser('Choose an option: ');

        switch (choice) {
            case '1':
                await userMenu();
                break;
            case '2':
                await itemMenu();
                break;
            case '3':
                await materialMenu();
                break;
            case '4':
                await toolMenu();
                break;
            case '5':
                rl.close();
                mongoose.connection.close();
                process.exit(0);
                break;
            default:
                console.log('Invalid option, please try again.');
        }
    }
}

// User Menu
async function userMenu() {
    while (true) {
        console.log('\nUser Actions');
        console.log('1. Create User');
        console.log('2. Find User');
        console.log('3. Update User');
        console.log('4. Delete User');
        console.log('5. List All Users');
        console.log('6. Use Item');
        console.log('7. Show Used Items');
        console.log('8. Build Something');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        switch (choice) {
            case '1':
                const name = await promptUser('Enter user name: ');
                const age = await promptUser('Enter user age: ');
                await addUser(name, age); // Using imported addUser function
                break;
            case '2':
                const userName = await promptUser('Enter user name to find: ');
                try {
                    const user = await findUserByName(userName);
                    console.log('User found:', user);
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case '3':
                const updateName = await promptUser('Enter user name to update: ');
                const updatedFields = {};
                const newAge = await promptUser('Enter new age (leave blank to skip): ');
                if (newAge) updatedFields.age = newAge;

                try {
                    await updateUser(updateName, updatedFields);
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case '4':
                const deleteName = await promptUser('Enter user name to delete: ');
                try {
                    await deleteUser(deleteName);
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case '5':
                await listAllUsers();
                break;
            case '6':
                const userToUseItem = await promptUser('Enter user name: ');
                const itemToUse = await promptUser('Enter item name: ');
                const quantityToUse = await promptUser('Enter quantity to use: ');
                  try {
                    await useItem(userToUseItem, itemToUse, parseInt(quantityToUse)); // Pass the quantity to useItem
                } catch (error) {
                    console.log(error.message);
                }
                break;              
            case '7':
                const userForUsedItems = await promptUser('Enter user name: ');
                try {
                    await getUsedItems(userForUsedItems);
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case '8':
        const userToBuild = await promptUser('Enter user name: ');        
            const inputed = await promptUser('Enter items and amounts (format: name1,amount1,name2,amount2,...): ');
            const inputArr = await inputed.split(',');
            const itemsNames = [];
            const itemsAmounts = [];

        for (let i = 0; i < inputArr.length; i += 2) {
            const name = inputArr[i].trim();
            const amount = parseInt(inputArr[i + 1].trim(), 10);

            if (isNaN(amount)) {
                console.log(`Invalid amount for item: ${name}`);
                rl.close();
                return;
            }

            itemsNames.push(name);
            itemsAmounts.push(amount);
        }

        try {
            await buildSmth(userToBuild,itemsNames, itemsAmounts); 
            console.log(error.message);
        } catch (error) {
            console.log(error.message);
        }
        break;   
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.');
        }; 
    };
} 

// Item Menu
async function itemMenu() {
    while (true) {
        console.log('\nItem Actions');
        console.log('1. Add Item');
        console.log('2. List All Items');
        console.log('3. Add Amount');
        console.log('4. Show Item Worth');
        console.log('5. Delete Item');
        console.log('6. Find Item');
        console.log('7. Update Item');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        switch (choice) {
            case '1':
                const name = await promptUser('Enter item name: ');
                const amount = await promptUser('Enter item amount: ');
                const cost = await promptUser('Enter item cost: ');
                await addItem(name, amount, cost); // Передаем параметры
                break;
            case '2':
                await listAllItems(); // Reuse existing method
                break;
            case '3':
                const addName = await promptUser('Enter item name to add amount: ');
                const addAmount = await promptUser('Enter amount to add: ');
                await addNewArrival(addName, parseInt(addAmount)); // Передаем параметры
                break;
            case '4':
                const worthName = await promptUser('Enter item name to show worth: ');
                const worth = await calculateWorth(worthName); // Передаем параметры
                console.log(`Worth of ${worthName}:`, worth);
                break;
            case '5':
                const deleteName = await promptUser('Enter item name to delete: ');
                await deleteItem(deleteName); // Передаем параметры
                break;
            case '6':
                const findName = await promptUser('Enter item name to find: ');
                const item = await findItemByName(findName); // Передаем параметры
                console.log('Found item:', item);
                break;
            case '7':
                const updateName = await promptUser('Enter item name to update: ');
                const updatedFields = {}; // Здесь можно собирать обновляемые поля
                const updateField = await promptUser('Enter field to update (name, amount, cost): ');
                const updateValue = await promptUser('Enter new value: ');
                updatedFields[updateField] = updateValue; // Обновляем поле
                await updateItem(updateName, updatedFields); // Передаем параметры
                break;
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.');
        }
    }
}


// Tool Menu
async function toolMenu() {
    while (true) {
        console.log('\nTool Actions');
        console.log('1. Craft Tool');
        console.log('2. Use Tool');
        console.log('3. Repair Tool');
        console.log('4. Show Tool Worth');
        console.log('5. List all Tools');
        console.log('6. Delete Tool');
        console.log('7. Update Tool');
        console.log('8. Find Tool');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        switch (choice) {
            case '1':
                // Get tool details from user
                const toolName = await promptUser('Enter tool name: ');
                const amount = parseInt(await promptUser('Enter amount: '), 10);
                const cost = parseFloat(await promptUser('Enter cost: '));
                const usage = parseInt(await promptUser('Enter usage (0-100): '), 10);
                const condition = parseInt(await promptUser('Enter condition (0-100): '), 10);
                await addTool(toolName, amount, cost, usage, condition);
                break;
            case '2':
                const useToolName = await promptUser('Enter tool name to use: ');
                const userName = await promptUser('Enter your username: ');
                await useTool(useToolName, userName);
                break;
            case '3':
                const repairToolName = await promptUser('Enter tool name to repair: ');
                await fixTool(repairToolName);
                break;
            case '4':
                const worthToolName = await promptUser('Enter Tool name to show worth: ');
                const worthTool = await calculateWorth(worthToolName); // Передаем параметры
                console.log(`Worth of ${worthToolName}:`, worthTool);
                break;
            case '5':
                await listAllTools();
                break;
            case '6':
                const deleteToolName = await promptUser('Enter tool name to delete: ');
                await deleteTool(deleteToolName);
                break;
            case '7':
                const updateToolName = await promptUser('Enter tool name to update: ');
                const updatedFields = {}; // Collect updated fields from user
                const newUsage = await promptUser('Enter new usage (0-100) or leave blank to keep current: ');
                if (newUsage) updatedFields.usage = parseInt(newUsage, 10);
                // Collect other fields if necessary...
                await updateTool(updateToolName, updatedFields);
                break;
            case '8':
                const findToolName = await promptUser('Enter tool name to find: ');
                await findToolByName(findToolName);
                break;
            case '0':
                return; // Return to main menu
            default:
                console.log('Invalid option, please try again.');
        }
    }
}

// Material Menu
async function materialMenu() {
    while (true) {
        console.log('\nMaterial Actions');
        console.log('1. Add Material');
        console.log('2. Use Material');
        console.log('3. Show Material Worth');
        console.log('4. Delete Material');
        console.log('5. Find Material by Name');
        console.log('6. Update Material');
        console.log('7. List All Materials');
        console.log('0. Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        switch (choice) {
            case '1':
                const materialName = await promptUser('Enter material name: ');
                const materialAmount = parseInt(await promptUser('Enter amount: '), 10);
                const materialCost = parseFloat(await promptUser('Enter cost: '));
                const supplier = await promptUser('Enter supplier name: ');
                const quality = await promptUser('Enter quality: ');
                await addMaterial(materialName, materialAmount, materialCost, supplier, quality);
                break;

            case '2':
                const useMaterialName = await promptUser('Enter material name to use: ');
                const amountToUse = parseInt(await promptUser('Enter amount to use: '), 10);
                await useMaterial(useMaterialName, amountToUse);
                break;

            case '3':
                const worthMaterialName = await promptUser('Enter material name: ');
                const worth = await calculateWorth(worthMaterialName);
                console.log(`Worth of ${worthMaterialName}:`, worth);

            case '4':
                const deleteMaterialName = await promptUser('Enter material name to delete: ');
                await deleteMaterial(deleteMaterialName);
                break;

            case '5':
                const findMaterialName = await promptUser('Enter material name to find: ');
                try {
                    const foundMaterial = await findMaterialByName(findMaterialName);
                    console.log('Material found:', foundMaterial);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '6':
                const updateMaterialName = await promptUser('Enter material name to update: ');
                const updatedFields = {}; // Object to store updated fields
                const newAmount = await promptUser('Enter new amount (leave blank to keep current): ');
                if (newAmount) updatedFields.amount = parseInt(newAmount, 10);
                const newCost = await promptUser('Enter new cost (leave blank to keep current): ');
                if (newCost) updatedFields.cost = parseFloat(newCost);
                const newSupplier = await promptUser('Enter new supplier (leave blank to keep current): ');
                if (newSupplier) updatedFields.supplier = newSupplier;
                const newQuality = await promptUser('Enter new quality (leave blank to keep current): ');
                if (newQuality) updatedFields.quality = newQuality;

                try {
                    await updateMaterial(updateMaterialName, updatedFields);
                } catch (error) {
                    console.log(error.message);
                }
                break;

            case '7':
                await listAllMaterials();
                break;

            case '0':
                return; // Return to main menu

            default:
                console.log('Invalid option, please try again.');
        }
    }
}
