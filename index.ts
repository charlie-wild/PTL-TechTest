interface Transaction {
    sku: string;
    qty: number;
    type: string;
}

interface StockItem {
    sku: string;
    stock: number;
}


const getCurrentStockLevel = (sku: string) => {
    return new Promise((resolve, reject) => {
        const stock: Array<StockItem> = require('./data/stock.json');
        const transactions: Array<Transaction> = require('./data/transactions.json');

        const existsInStock = stock.filter(item => item.sku === sku).length > 0;
        const existsInTransactions = transactions.filter(item => item.sku === sku).length > 0;

        if (!existsInStock && !existsInTransactions) {
            reject(new Error(`SKU ${sku} does not exist in stock.json or transactions.json`));
        }

        let initialStockLevel = 0;

        if (existsInStock) {
            initialStockLevel = stock.find(item => item.sku === sku).stock;
        }

        const transactionsMade = transactions.filter(transaction => transaction.sku === sku);

        const totalStockChange = calcualateStockLevelChange(transactionsMade);

        const currentStockLevel = initialStockLevel + totalStockChange;

        resolve({ sku, qty: currentStockLevel });

    });
}


const calcualateStockLevelChange = (transactionsMade: Array<Transaction>) => {
    let totalStock = 0;
    for (let i = 0; i < transactionsMade.length; i++) {
        if (transactionsMade[i].type === 'order') {
            totalStock -= transactionsMade[i].qty;
        } else {
            totalStock += transactionsMade[i].qty;
        }
    }
    return totalStock;
}





module.exports = getCurrentStockLevel;