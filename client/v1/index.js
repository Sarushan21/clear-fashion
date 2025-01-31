// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable
console.log("🎯 TODO 1: The cheapest t-shirt");
const urlCheapest= "https://adresse.paris/t-shirts-et-polos/4238-t-shirt-ranelagh-1300000262026.html";
console.log(urlCheapest);

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable
console.log("🎯 TODO 2: Number of products");
var numberProduct = marketplace.length;
console.log(numberProduct);

// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have
console.log("🎯 TODO 3: Brands name");
var listBrand=[];
for (var i=0; i<marketplace.length; i++){
  if (!listBrand.includes(marketplace[i].brand))
  {
    listBrand.push(marketplace[i].brand);
  }
}
console.log(listBrand);


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable
console.log("🎯 TODO 4: Sort by price");
var marketplacePrice = marketplace.sort((a,b) => (a.price>b.price)? 1 :-1);
console.log(marketplacePrice);

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable
console.log("🎯 TODO 5: Sort by date");
var marketplaceDate = marketplace.sort((a, b) => {
  if (new Date(b.date) > new Date(a.date)) return -1;
  if (new Date(b.date) < new Date(a.date)) return 1;
  else return 0;
});
console.log(marketplaceDate);

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list
console.log("🎯 TODO 6: Filter a specific price range");
var filterPrice = marketplace.filter(function(price) {
  return price.price <= 100 && price.price >= 50;
});
console.log(filterPrice);

// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
// 2. Log the average
console.log("🎯 TODO 7: Average Basket");
var basket = marketplace.filter(a => a.name.toLowerCase().includes('basket') || a.name.toLowerCase().includes("sneakers"));
var averagePriceBasket = 0;
for (var i=0; i<basket.length; i++){
  averagePriceBasket += basket[i].price;
}
averagePriceBasket = averagePriceBasket/basket.length;
console.log(`${averagePriceBasket} € on average`);






/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands
console.log("🎯 TODO 8: Products by brands");
var brands = {};
for(var brandKey in listBrand){
  var brandValue = [];
  for (var i=0; i<marketplace.length; i++){
    if (marketplaceDate[i].brand==listBrand[brandKey]){
      brandValue.push(marketplace[i]);
    }
  }
  brands[brandKey]=brandValue;
}
console.log(brands);

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort
console.log("🎯 TODO 9: Sort by price for each brand");
for (var brandKey in brands){
  brands[brandKey].sort((a,b) => {
    if (a.price > b.price) return -1;
    if (a.price < b.price) return 1;
    else return 0;
  });
}
console.log(brands);
// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort
console.log("🎯 TODO 10: Sort by date for each brand");
for (var brandKey in brands){
  brands[brandKey].sort((a,b) => {
    if (new Date(a.date) > new Date(b.date)) return -1;
    if (new Date(a.date) < new Date(b.date)) return 1;
    else return 0;
  });
}
console.log(brands);




/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
console.log("🎯 TODO 11: Compute the p90 price value");
for (var brandKey in brands){
  brands[brandKey].sort((a,b) => (a.price>b.price)? 1 :-1);
  var p90 = Math.floor(brands[brandKey].length*0.9);
  console.log(`${brands[brandKey][p90].brand}: ${brands[brandKey][p90].price}`);  
}




/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.
console.log("🎯 TODO 12: New released products");
for (var i=0; i<COTELE_PARIS.length; i++){
  console.log(new Date(COTELE_PARIS[i].released));
  console.log(new Date(COTELE_PARIS[i].released) > Date.now() - (1000 * 60 * 60 * 24 * 14));
}

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€
console.log("🎯 TODO 13: Reasonable price");
var test=true;
for (var i=0; i<COTELE_PARIS.length; i++){
  if (COTELE_PARIS[i].price>100){
    test=false;
  }
}
console.log(`Reasonable Price: ${test}`);

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product
console.log("🎯 TODO 14: Find a specific product");
var test = false;
for (var i=0; i<COTELE_PARIS.length; i++){
  if (COTELE_PARIS[i].uuid == "b56c6d88-749a-5b4c-b571-e5b5c6483131" ){
    var test = true;
    console.log(COTELE_PARIS[i]);
  }
}
if (!test){
  console.log("The product doesn't exist :(");
}

// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product
console.log("🎯 TODO 15: Delete a specific product");
for (var i=0; i<COTELE_PARIS.length; i++){
  if (COTELE_PARIS[i].uuid === "b56c6d88-749a-5b4c-b571-e5b5c6483131" ){
    COTELE_PARIS.splice(i,1);
    console.log("The product has been deleted!");
  }
}

// 🎯 TODO: Save the favorite product
console.log("🎯 TODO 16: Save the favorite product");
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;
jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
console.log(blueJacket);
console.log(jacket);
// 2. What do you notice?
// ---------------Both of them have the property 'favorite' to true---------------

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties
console.log("Let update 'jacket' property with `favorite` to true WITHOUT changing blueJacket properties")
const new_jacket = Object.assign({}, blueJacket);
new_jacket.favorite = true;
console.log(blueJacket);
console.log(new_jacket);


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
console.log("🎯 TODO 17: Save in localStorage");
localStorage.setItem('My_Favorite_Brand', `${new_jacket.uuid}`);
console.log(localStorage);cd 