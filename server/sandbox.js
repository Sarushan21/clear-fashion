/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const db = require('./db');


module.exports.sandbox = async (eshop = 'https://www.dedicatedbrand.com/en/loadfilter?', shopname="dedicatedbrand") => {
    try {
      console.log(`🌐|Browsing... ${eshop}|🌐`);
      const products = await dedicatedbrand.scrape(eshop,shopname);
      console.log('[End: Web Scraping]');
      //const result = await db.insert(products);
      //console.log(`💽  ${result.insertedCount} inserted products`);
      //console.log('\n');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
}

//const [,, eshop,shopname] = process.argv;
//sandbox(eshop,shopname);