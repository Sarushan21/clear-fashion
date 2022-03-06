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
    //const categoryList = ["Chaussures", "Pulls & Sweats", "Chemises", "Polos & T-shirts", "Accessoires", "Bas"];
    const categoryList = ["Pulls & Sweats","Chemises"];
    if (categoryList.includes($(value).text())){
      var link = $(value).attr('href') + limit;
      console.log(link);
      urlList.push(link);
    }
  });
  return(urlList);   
};

const fetchAll = async (urls) => {
  const res = await Promise.all(urls.map(u => fetch(u)));
  const texts = await Promise.all(res.map(r => r.text()));
  return (texts);
}

const parseMontlimart = data => {
  const $ = cheerio.load(data);
  return $('.category-products .item')
    .map((i, element) => {
      if (parseFloat($(element).find('.product-info .price-box .price').text().trim())){
        const name = $(element).find('.product-info .product-name').text().trim();
        console.log(name);
        const price = parseFloat($(element).find('.product-info .price-box .price').text().trim().replace(/,/g,'.'));
        console.log($(element).find('.product-info .price-box .price').text().trim())
        console.log(price);
        const image = $(element).find('.product-image').find('a').find('img').attr('src');
        console.log(i);
        return {name, price, image};
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
 const getURL = async (data) => {
  var $ = cheerio.load(data);
  var url = $('.container ').find('nav').find('ul').find('li').find('a').attr('href');
  console.log(url);
  console.log(typeof url);
  
  return (fetch(url)
    .then(response => {
      console.log("aaa");
      console.log(response);
      return response.text()
    })
    .then(body => { 
      console.log(body)
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      $ = cheerio.load(body);
      console.log($('.content_sortPagiBar' ).find('div').find('div').find('form').find('div').find('input').attr('type'));
      console.log("aaaaaaaaa");
    }).catch(err => {
      console.error('Failed to fetch - ' + url);
      console.error(err);
    }))
 }

const fetchAll1 = async (urls) => {
  const res = await Promise.all(urls.map(u => fetch(u)));
  const texts = await Promise.all(res.map(r => r.text()));
  return (texts);
}

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
        var fullProducts =  parseDedicated(body);
        console.log(fullProducts);
        //var myJsonString = JSON.parse(JSON.stringify(fullProducts));
        //console.log(myJsonString);
        console.log("__________________________________________________________________________________")

      }
      if (brand=="montlimart"){
        console.log("___Response Ok___");
        const body = await response.text();

        const urlList = getURLMontlimart(body);
        const bodyList = await fetchAll(urlList);

        var fullProducts = [];
        bodyList.forEach(body => {
          const categoryProducts = parseMontlimart(body);
          fullProducts = fullProducts.concat(categoryProducts);
          console.log(fullProducts);
          console.log(fullProducts.length);
        })
        //var myJsonString = JSON.stringify(fullProducts);
        //console.log(myJsonString);
        console.log("__________________________________________________________________________________")
      }

      if (brand=="adresseParis"){
        console.log("___Response Ok___");
        const body = await response.text();

        const urlCollection = await getURL(body);
        console.log(urlCollection)
        //const bodyCollection = await fetchAll1([urlFullCollecion]);
        
        

      }


    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
