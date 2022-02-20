const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
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
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
 const getURL = data => {
  urlList = [];
  const $ = cheerio.load(data);
  
  var url =  $('.skip-content .nav-primary').find('li').find('a').each( (index, value) => {
    //const categoryList = ["Chaussures","Pulls & Sweats","Chemises","Polos & T-shirts","Accessoires","Bas"];
    const categoryList = ["Chaussures","Pulls & Sweats"]
    if (categoryList.includes($(value).text())){
      var link = $(value).attr('href');
      urlList.push(link);
    }
  });
  console.log(urlList);
  return(urlList);   
};

const fetchAll = async (urls) => {
  const res = await Promise.all(urls.map(u => fetch(u)));
  const texts = await Promise.all(res.map(r => r.text()));
  return (texts);
}

const puppeteer = require('puppeteer');

const dynamicScraping = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  console.log(page)

  await page.goto(url);

  const textContent = await page.evaluate(() => {
    return document.querySelector('.npm-expansions').textContent
  });
  console.log(textContent); /* No Problem Mate */

  browser.close();
};

//function sleep(ms) {
//  console.log("sleeeeeeep")
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

const parseMontlimart = data => {
  const $ = cheerio.load(data);
  return $('.category-products .item')
    .map((i, element) => {
      if (parseFloat($(element).find('.product-info .price-box .price').text().trim()) ){
        const name = $(element).find('.product-info .product-name').text().trim()
        console.log(name)
        const price = parseFloat($(element).find('.product-info .price-box .price').text().trim()).toFixed(2)
        console.log(price)
        const image = $(element).find('.product-image').find('a').find('img').attr('src')
        console.log(image)
        //sleep(30000000).then(() => { console.log(`Waiting 3 seconds...`);});
        setTimeout(() => {  console.log("World!"); }, 2000);
        console.log(i)
              
      
        return {name, price, image};
      }
    })
    .get();
};



/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url, brand)  => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      if (brand=="dedicatedbrand"){
        console.log("___Response Ok___");
        const body = await response.json();
        return parseDedicated(body);
      }
      if (brand=="montlimart"){
        console.log("___Response Ok___");
        const body = await response.text();
        const urlList = getURL(body);
        
        urlList.forEach(url => {
          dynamicScraping(url)
        
        //const bodyList = await fetchAll(urlList);
        //var fullProducts = []
        //bodyList.forEach(body => {
          //categoryProducts = parseMontlimart(body);
          //console.log(categoryProducts)
          //fullProducts = fullProducts.push.apply(fullProducts,parseMontlimart(body));
        })

        
          
        //urlList.forEach(link => {
          //console.log(link);
          //const responseLink = fetch(link);
          //const bodyLink = responseLink.text(); 
          //console.log(bodyLink);
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        //})
        
      }
    }
    //console.error(response);
    return null;
    
  } catch (error) {
    console.error(error);
    return null;
  }
};
