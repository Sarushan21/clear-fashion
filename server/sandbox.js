const dedicatedbrand = require('./sources/dedicatedbrand');
const db = require('./db');


module.exports.sandbox = async (eshop = 'https://www.dedicatedbrand.com/en/loadfilter?', shopname="dedicatedbrand") => {
    try {
      console.log(`🌐|Browsing... ${eshop}|🌐`);
      const fullProducts = await dedicatedbrand.scrape(eshop,shopname);
      console.log('[End: Web Scraping]');
      return fullProducts
      
    } catch (e) {
      console.error("❌|Error: Sandbox Function...");
      console.error("__________________________________________________________________________________");
      console.error(e);
      process.exit(1);
    }
}


async function sandbox(eshop = 'https://www.dedicatedbrand.com/en/loadfilter?', shopname="dedicatedbrand") {
    try {
      console.log(`🌐|Browsing... ${eshop}|🌐`);
      const products = await dedicatedbrand.scrape(eshop,shopname);
      console.log('[End: Web Scraping]');

    } catch (e) {
      console.error(e);
      process.exit(1);
    }
}

const [,, eshop,shopname] = process.argv;
sandbox(eshop,shopname);