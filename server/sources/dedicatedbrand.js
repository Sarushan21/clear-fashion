const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

//////////////////////////////////////// DEDICATED SHOP SCRAPING ////////////////////////////////////////

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseDedicated = data => {
  var fullProducts = [];
  data.products.forEach(product => {        
    if(product.id != undefined){
      var link='https://www.dedicatedbrand.com/en/'+product.canonicalUri;
      var released='2022-03-'+Math.round(Math.random()* 30 + 1).toString()
      fullProducts.push({
        '_id': uuidv5(link, uuidv5.URL),
        "brand": "dedicated",
        "name": product.name,
        "price": product.price.priceAsNumber,
        "released": released,
        "image": product.image[0],
        "link": 'https://www.dedicatedbrand.com/en/' + product.canonicalUri
      });
    }
  });
  return Object.assign([], fullProducts);
};

//////////////////////////////////////// MONTLIMART SHOP SCRAPING ///////////////////////////////////////

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
 const getURLMontlimart = (data) => {
  const $ = cheerio.load(data);

  var urlList=[];
  var limit = "?limit=all";
  var urlCategory =  $('.skip-content .nav-primary').find('li').find('a').each( (index, value) => {
    const categoryList = ["Chaussures", "Pulls & Sweats", "Chemises", "Polos & T-shirts", "Bas"];
    if (categoryList.includes($(value).text())){
      var link = $(value).attr('href') + limit;
      urlList.push(link);
    }
  });
  return(urlList);   
};

const fetchAllMontlimart = async (urls) => {
  const resp = await Promise.all(urls.map(u => fetch(u)));
  const bodies = await Promise.all(resp.map(r => r.text()));
  return (bodies);
}

const parseMontlimart = data => {
  const $ = cheerio.load(data);
  return $('.category-products .item')
    .map((i, element) => {
      if (parseFloat($(element).find('.product-info .price-box .price').text().trim())){
        const brand = "montlimart";
        const name = $(element).find('.product-info .product-name').text().trim();
        const price = parseFloat($(element).find('.product-info .price-box .price').text().trim().replace(/,/g,'.'));
        const released='2022-03-'+Math.round(Math.random()* 30 + 1).toString();
        const image = $(element).find('.product-image').find('a').find('img').attr('src');
        const link = $(element).find('.product-info .product-name').find('a').attr('href');
        return {'_id': uuidv5(link, uuidv5.URL), brand, name, price, released, image, link};
      }
    })
    .get();
};

///////////////////////////////////// ADRESSE PARIS SHOP SCRAPING ///////////////////////////////////////

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const getURLAdresseParis = async (data) => {
  var $ = cheerio.load(data);
  var path = $('.container ').find('nav').find('ul').find('li').find('a');
  const url = path.attr('href');
  
  return fetch(url)
    .then(response => { return response.text() })
    .then(body => { 
      var $ = cheerio.load(body);
      var name = [];
      var val = [];
      var path = $('.content_sortPagiBar').find('div').find('div').find('form').find('div').find('input').each( (index, value) => {
        name.push($(value).attr("name"));
        val.push($(value).attr("value"));
      })
      const urlALL = url+ "?" + name[0] + "=" + val[0] + "&" + name[1] + "=" + val[1]; 
      return (urlALL);
    }).catch(err => {
      console.error('Failed to fetch --- ' + url);
      console.error(err);
    })
}

const fetchAllAdresseParis = async (url) => {
  const resp = await fetch(url);
  const body = await resp.text();
  return (body);
}

const parseAdresseParis = data => {
  const $ = cheerio.load(data);
  return $('.product_list.grid.row').find('li')
    .map((i, element) => {
      if (parseFloat($(element).find('.product-container .right-block .prixright .content_price .price.product-price').text().trim())){
        const brand = 'adresseParis';
        const name = $(element).find('.product-container .right-block .product-name-container.versionmob .product-name').text().trim();
        const price = parseFloat($(element).find('.product-container .right-block .prixright .content_price .price.product-price').text().trim().replace(/,/g,'.'));
        const released='2022-03-'+Math.round(Math.random()* 30 + 1).toString();
        const image = $(element).find('.product-container .left-block .product-image-container').find('a').find('img').attr('src');
        const link = $(element).find('.product-container .right-block .product-name-container.versionmob').find('a').attr('href');
        return {'_id': uuidv5(link, uuidv5.URL), brand, name, price, released, image, link};
      }
    })
    .get();
};

/*********************************************************************************************************/
/*                                               WEB SCRAPING                                            */
/*********************************************************************************************************/

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
        //Initialisation of web scraping
        console.log("🟢|Response Ok!\n");
        console.log("🔎|Start of Web Scraping...");

        //Web Scraping
        const body = await response.json();
        var fullProducts =  parseDedicated(body);
        console.log("📘|Web Scraping Completed!!!");
        console.log(`🧢|List of all Products in ${brand}: `);
        console.log(fullProducts);
        console.log(`${fullProducts.length} Products in ${brand}`);
        console.log("__________________________________________________________________________________");
      }

      if (brand=="montlimart"){
        //Initialisation of web scraping
        console.log("🟢|Response Ok!\n");
        console.log("🔎|Start of Web Scraping...");

        //Web Scraping
        const body = await response.text();
        const urlList = getURLMontlimart(body);
        const bodyList = await fetchAllMontlimart(urlList);

        var fullProducts = [];
        bodyList.forEach(body => {
          const categoryProducts = parseMontlimart(body);
          fullProducts = fullProducts.concat(categoryProducts);
        })
        console.log("📘|Web Scraping Completed!!!");
        console.log(`🧢|List of all Products in ${brand}: `);
        console.log(fullProducts);
        console.log(`${fullProducts.length} Products in ${brand}`);
        console.log("__________________________________________________________________________________");
      }

      if (brand=="adresseParis"){
        //Initialisation of web scraping
        console.log("🟢|Response Ok!\n");
        console.log("🔎|Start of Web Scraping...");

        //Web Scraping
        const body = await response.text();
        const urlALL= await getURLAdresseParis(body);
        const bodyALL = await fetchAllAdresseParis(urlALL);

        var fullProducts = [];
        fullProducts = parseAdresseParis(bodyALL);
        console.log("📘|Web Scraping Completed!!!");
        console.log(`🧢|List of all Products in ${brand}: `);
        console.log(fullProducts);
        console.log(`${fullProducts.length} Products in ${brand}`);
        console.log("__________________________________________________________________________________");
      }
    }
    //var myJsonString = JSON.stringify(fullProducts);
    //console.log(myJsonString);
    return fullProducts;
  } catch (error) {
    console.error("❌|Error: Web Scraping Failed...");
    console.error("__________________________________________________________________________________");
    console.error(error);
    return null;
  }
};