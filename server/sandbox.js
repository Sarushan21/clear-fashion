/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/loadfilter?', shopname="dedicatedbrand") {
  if (shopname === "dedicatedbrand"){
    try {
      console.log(`🕵️‍♀️  browsing ${eshop} source`);

      const products = await dedicatedbrand.scrape(eshop);

      console.log(products);
      console.log('End');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
