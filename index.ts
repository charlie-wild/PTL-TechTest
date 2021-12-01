interface Transaction {
    sku: string;
    qty: number;
    type: string;
}

interface StockItem {
    sku: string;
    stock: number;
}


const getCurrentStockLevel = (sku: string): Promise<{ sku: string, qty: number }> => {
    return new Promise((resolve, reject) => {
        const stock: Array<StockItem> = require('./data/stock.json');
        const transactions: Array<Transaction> = require('./data/transactions.json');

        const existsInStock: boolean = stock.filter(item => item.sku === sku).length > 0;
        const existsInTransactions: boolean = transactions.filter(item => item.sku === sku).length > 0;

        if (!existsInStock && !existsInTransactions) {
            reject(new Error(`SKU ${sku} does not exist in stock.json or transactions.json`));
        }

        let initialStockLevel: number = 0;

        if (existsInStock) {
            initialStockLevel = stock.find(item => item.sku === sku).stock;
        }

        const transactionsMade: Transaction[] = transactions.filter(transaction => transaction.sku === sku);

        const totalStockChange: number = calcualateStockLevelChange(transactionsMade);

        const currentStockLevel: number = initialStockLevel + totalStockChange;

        resolve({ sku, qty: currentStockLevel });

    });
}


const calcualateStockLevelChange = (transactionsMade: Array<Transaction>): number => {
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