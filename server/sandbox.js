/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');

async function sandbox(eshop = 'https://www.dedicatedbrand.com/en/loadfilter?', shopname="dedicatedbrand") {
//  if (shopname === "montlimart"){
    try {
      console.log(`\n🕵️‍♀️  browsing ${eshop} source\n`);
      const products = await dedicatedbrand.scrape(eshop,shopname);

      console.log(products);
      console.log('End');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
//  }
}



const [,, eshop,shopname] = process.argv;

sandbox(eshop,shopname);
