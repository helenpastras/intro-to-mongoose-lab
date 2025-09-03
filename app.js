const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customers');


const prompt = require('prompt-sync')();

const username = prompt('What is your name? ');
console.log(`Welcome to the CRM ${username}!`);

const menuOptions = async () => {
    let running = true;

    while (running) {
        console.log('\n--- Customer Menu ---');
        console.log('1. Create Customer');
        console.log('2. View Customers');
        console.log('3. Update Customer');
        console.log('4. Delete Customer');
        console.log('5. Quit')

        const userChoice= prompt("What would you like to do? Choose an option (1-4): ");

        switch (userChoice) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewCustomer();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                running = false;
                console.log("Thank you. Goodbye!");
                mongoose.disconnect();
                 break;    

            }

    }
}

const createCustomer = async () => {
    const name = prompt("Enter name: ")
    const age = prompt("Enter age: ")

    const customer = new Customer({name, age});
    await customer.save();
    console.log("Customer created");
}

const viewCustomer = async () => {
    const customers = await Customer.find();
    console.log("Customer List:");
    customers.forEach(c => {
        console.log(`${c._id}: ${c.name} | ${c.age}`)
    });
}

const updateCustomer = async () => {
    await viewCustomer();
    const id = prompt("Enter ID of customer to update: ");
    const name = prompt("New name:")
    const age = prompt("New age:")

    await Customer.findByIdAndUpdate(id,{name, age});
    console.log("Customer updated")
}

const deleteCustomer = async () => {
    await viewCustomer();
    const id = prompt("Enter ID of customer to delete: ");
    await Customer.findByIDAndDelete(id);
       console.log(`Customer with ID ${id} has been deleted.`);
}
 


const connect = async () => {
  // Connect to MongoDB using the MONGODB_URI specified in our .env file.
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Call the runQueries function, which will eventually hold functions to work
  // with data in our db.
  await runQueries()

  // Disconnect our app from MongoDB after our queries run.
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');

  // Close our app, bringing us back to the command line.
  process.exit();
};

const runQueries = async () => {
  console.log('Queries running.')
  await menuOptions();

}

connect();
