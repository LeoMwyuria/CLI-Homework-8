
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

const dataFilePath = path.join(__dirname, 'expenses.json');


if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

const getExpenses = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const saveExpenses = (expenses) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
};

program
    .version('1.0.0')
    .description('CLI tool to manage your budget');


program
    .command('add')
    .description('Add a new expense')
    .option('-d, --description <description>', 'Description of the expense')
    .option('-a, --amount <amount>', 'Amount of the expense')
    .action((options) => {
        if (!options.description || !options.amount) {
            console.error('Description and amount are required.');
            process.exit(1);
        }

        const expenses = getExpenses();
        const newExpense = {
            id: Date.now().toString(),
            description: options.description,
            amount: parseFloat(options.amount),
        };

        expenses.push(newExpense);
        saveExpenses(expenses);
        console.log('Expense added:', newExpense);
    });


program
    .command('delete')
    .description('Delete an expense')
    .option('-i, --id <id>', 'ID of the expense to delete')
    .action((options) => {
        if (!options.id) {
            console.error('ID is required.');
            process.exit(1);
        }

        let expenses = getExpenses();
        const initialLength = expenses.length;
        expenses = expenses.filter(expense => expense.id !== options.id);

        if (expenses.length === initialLength) {
            console.error('Expense not found.');
            process.exit(1);
        }

        saveExpenses(expenses);
        console.log('Expense deleted.');
    });


program
    .command('show')
    .description('Show all expenses')
    .action(() => {
        const expenses = getExpenses();
        if (expenses.length === 0) {
            console.log('No expenses found.');
        } else {
            console.log('All expenses:');
            expenses.forEach(expense => {
                console.log(`ID: ${expense.id}, Description: ${expense.description}, Amount: ${expense.amount}`);
            });
        }
    });

program.parse(process.argv);
//gasatestad:
//node budget.js add --description "Lunch" --amount 12.50
//node budget.js delete --id <expenseId>
//node budget.js show