const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  console.log($);
  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      
      );

      return {name, price};
    })
    .get();
};

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseDedicated = data => {
  var fullProducts = [];

  data.products.forEach(product => {        
    if(product.id != undefined){
      fullProducts.push({
        "id": product.id,
        "name": product.name,
        "brand": "dedicated",
        "price": product.price.priceAsNumber,
        "discount": product.discountPercent + "%",
        "image": product.image[0],
        "link": 'https://www.dedicatedbrand.com/en/' + product.canonicalUri
      });
    }
  });
  return Object.assign({}, fullProducts);
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log("___Response Ok___");
      const body = await response.json();
      return parseDedicated(body);

    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
