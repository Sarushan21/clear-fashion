/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const loom = require('./sites/loom');
const db = require('./mongoDB');
//const sand = require("./sandbox")

//console.log(sand.sandbox())

async function sandboxdb () {
  try {
    let products = [];
    let dedicatedBrand = null
    let pages = [
      'https://www.dedicatedbrand.com/en/men/basics',
      'https://www.dedicatedbrand.com/en/men/sale'
    ];

    //console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      //console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape(page);
      //console.log(`👕 ${results.length} products found`);
      products.push(results);
    }

    pages = [
      'https://www.loom.fr/collections/hauts',
      'https://www.loom.fr/collections/bas'
    ];

    //console.log('\n');
    //console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map(page => loom.scrape(page));
    const results = await Promise.all(promises);

    //console.log(`👕 ${results.length} results of promises found`);
    //console.log(`👕 ${results.flat().length} products found`);
    //console.log(results);
    //console.log(results.flat());
    //console.log("\n");

    products.push(results.flat());
    products = products.flat();
    //console.log(`👕 ${products.length} total of products found`);
    


    const database = await db.mongoConnection();
    const result = await db.mongoInsert(products,database);
    
    console.log('Find Loom products only');
    const loomOnly = await db.mongoQuery({'brand': 'loom'},database);
    //console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    //console.log(loomOnly);
    await db.mongoClose();
    //console.log("Closed")
  } catch (e) {
    console.error(e);
  }
}

sandboxdb();