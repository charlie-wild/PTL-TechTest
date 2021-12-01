const getCurrentStockLevel = require('../index.js')



test('it returns the current stock level for a given SKU', async () => {
    const result = await getCurrentStockLevel('LTV719449/39/39')
    expect.assertions(1);
    expect(result).toEqual({ 'qty': 8510, 'sku': 'LTV719449/39/39' });
})

test('it returns an error where the SKU does not exist in either of the data sets', async () => {
    expect.assertions(1);
    try {
        await getCurrentStockLevel('NOT VALID SKU')

    } catch (error) {
        expect(error).toEqual(new Error(`SKU NOT VALID SKU does not exist in stock.json or transactions.json`))
    }

})

test('it returns a stock level for products not initially in the stock data, when transactions are made', async () => {
    const result = await getCurrentStockLevel('TEST SKU NOT IN STOCK')
    expect.assertions(1);
    expect(result).toEqual({ 'qty': 5, 'sku': 'TEST SKU NOT IN STOCK' });
});