const getCurrentStockLevel = (sku) => {
    return new Promise((resolve, reject) => {
        const stock = require('./data/stock.json');
        const transactions = require('./data/transactions.json');

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


const calcualateStockLevelChange = (transactionsMade) => {
    let totalStock = 0;
    for (let i = 0; i < transactionsForSku.length; i++) {
        if (transactionsForSku[i].type === 'order') {
            totalStock -= transactionsForSku[i].qty;
        } else {
            totalStock += transactionsForSku[i].qty;
        }
    }
    return totalStock;
}



module.exports = getCurrentStockLevel;