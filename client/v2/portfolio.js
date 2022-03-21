// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};


// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#pagination #page-select');
const sectionProducts = document.querySelector('#products');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const selectRecent = document.querySelector('#recent-checkbox');
const selectReasonable = document.querySelector('#reasonable-checkbox');
const selectFavorite = document.querySelector('#favorite-checkbox');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbRecentProducts = document.querySelector('#nbRecentProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLastReleased = document.querySelector('#lastReleased');

var favoriteList = []
console.log(localStorage)
//localStorage.removeItem("User_Favorite_Brand")
if (localStorage.getItem('User_Favorite_Brand') !== null){
  favoriteList = favoriteList.concat(JSON.parse(localStorage.getItem('User_Favorite_Brand')))
}
console.log(favoriteList)

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    console.log(body.data)
    return body.data;

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.classList.add('productList');
  const template = products
    .map(product => {
      var jsonStringifyProduct = JSON.stringify(product)
      var checkbox = false;
      if (favoriteList !== null){
        var checkbox = favoriteList.includes(jsonStringifyProduct);
      }
      return `
      <div class="product" id=${product.uuid}>
        <div class="product-info">
        <img src="https://adresse.paris/30329-home_default/belleville-laine-laminee.jpg" >
        <h4>${product.brand}</h4>
        <a target="_blank" href="${product.link}">${product.name}</a>
        <h4>${product.price}</h4>
        </div>
        <div id="favorite-checkbox">
          <label for="favorite-select">Favorite</label>
          <input type="checkbox" id="favorite-checkbox" onclick='favoriteProduct(this,${jsonStringifyProduct})' name="favoriteProducts" value="favoriteCheckbox" ${checkbox ? "checked" : ""} >
        </div>
      </div>`;
    })
    .join('');
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selectorc
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {count, currentPage, pageCount, pageSize} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`)
    .join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
* Render list of products
* @param  {Array} products
*/
const renderBrand = products => {
  const brands=["Select brand name: ", "Default"];
  for (var i=0; i<products.length; i++){
    const {brand, link, name, photo, price, released, uuid} = products[i];
    if (!brands.includes(brand)){
      brands.push(brand);
    }  
  }
  const options = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`)
    .join('');
  selectBrand.innerHTML = options;
};


const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
};

const renderIndicatorsRecentProducts = products => {
  const nbRecentProducts = products.filter(product => { return new Date(product.released) > Date.now() - (1000 * 60 * 60 * 24 * 14 )}).length;
  spanNbRecentProducts.innerHTML = nbRecentProducts;
};

const renderIndicatorsPriceValue = products => {
  const sortedProducts = products.sort((a,b) => (a.price>b.price)? 1 :-1)
  var p50 = Math.floor(sortedProducts.length*0.5);
  var p90 = Math.floor(sortedProducts.length*0.9);
  var p95 = Math.floor(sortedProducts.length*0.95);
  spanP50.innerHTML = sortedProducts[p50].price;
  spanP90.innerHTML = sortedProducts[p90].price;
  spanP95.innerHTML = sortedProducts[p95].price;
};

const renderIndicatorsLastReleased = products => {
  const lastReleasedDate = products.sort((a,b) => {
    if (new Date(a.date) > new Date(b.date)) return -1;
    if (new Date(a.date) < new Date(b.date)) return 1;
    else return 0;
  });
  spanLastReleased.innerHTML = lastReleasedDate[0].released;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderIndicatorsRecentProducts(products);
  renderIndicatorsPriceValue(products);
  renderIndicatorsLastReleased(products);  
  renderBrand(products);
};





/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */

console.log("Feature 0: Show more");
selectShow.addEventListener('change', event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  selectSort.value="default";
  fetchProducts(1, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

console.log("Feature 1: Browse pages");
selectPage.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  selectSort.value="default";
  const products = await fetchProducts(event.target.value, currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

console.log("Feature 2: Filter by brands");
selectBrand.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  selectSort.value="default";
  if (event.target.value !== "Default"){ 
    //Filter by brands
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    const filterProductsBrands = products.result.filter(product => { return product.brand.includes(event.target.value)});
    console.log("Brands products:")
    console.log(filterProductsBrands)
    //Copy of products objet in order to add modifications
    const newProducts = JSON.parse(JSON.stringify(products));
    newProducts.result = filterProductsBrands;
    setCurrentProducts(newProducts);
    render(newProducts.result, currentPagination);
  }
  else {
    const products = await fetchProducts(1,currentPagination.pageSize);   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

console.log("Feature 3: Filter by recent products");
selectRecent.addEventListener('change', async event => {
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  selectSort.value="default";
  if (event.target.checked === true){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    const filterRecentProducts = products.result.filter(product => { return new Date(product.released) > Date.now() - (1000 * 60 * 60 * 24 * 14) });
    console.log("Recent products:")
    console.log(filterRecentProducts)
    
    const recentProducts = JSON.parse(JSON.stringify(products));
    recentProducts.result = filterRecentProducts;
    setCurrentProducts(recentProducts);
    render(recentProducts.result, currentPagination);
  }
  else{
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  } 
})


console.log("Feature 4: Filter by reasonable price");
selectReasonable.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectFavorite.checked=false;
  selectSort.value="default";
  if (event.target.checked === true){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    const filterCheaperProducts = products.result.filter(product => { return product.price < 50 });
    console.log("Reasonable products:")
    console.log(filterCheaperProducts)
    
    const cheaperProducts = JSON.parse(JSON.stringify(products));
    cheaperProducts.result = filterCheaperProducts;
    setCurrentProducts(cheaperProducts);
    render(cheaperProducts.result, currentPagination);
  }
  else{
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  } 
})

console.log("Feature 5: Sort by price");
selectSort.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  if (event.target.value === "price-asc" || event.target.value === "price-desc"){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    if (event.target.value === "price-asc"){
      var sortProductsPrice = products.result.sort((a,b) => (a.price>b.price)? 1 :-1);}
    else{
      var sortProductsPrice = products.result.sort((a,b) => (a.price<b.price)? 1 :-1);}
    
    console.log("Sorted products by price:")
    console.log(sortProductsPrice)

    const sortedProducts = JSON.parse(JSON.stringify(products));
    sortedProducts.result = sortProductsPrice;
    setCurrentProducts(sortedProducts);
    render(sortedProducts.result, currentPagination);
  }
});

console.log("Feature 6: Sort by date");
selectSort.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  if (event.target.value === "date-asc" || event.target.value === "date-desc"){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    if (event.target.value === "date-asc"){
      var sortProductsDate = products.result.sort((a,b) => {
        if (new Date(b.released) > new Date(a.released)) return -1;
        if (new Date(b.released) < new Date(a.released)) return 1;
        else return 0;
      });
    }
    else{
      var sortProductsDate = products.result.sort((a,b) => {
        if (new Date(b.released) < new Date(a.released)) return -1;
        if (new Date(b.released) > new Date(a.released)) return 1;
        else return 0;
      });
    }
    console.log("Sorted products by date:")
    console.log(sortProductsDate)

    const sortedProducts = JSON.parse(JSON.stringify(products));
    sortedProducts.result = sortProductsDate;
    setCurrentProducts(sortedProducts);
    render(sortedProducts.result, currentPagination);
  }
});

selectSort.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectFavorite.checked=false;
  if (event.target.value === "default"){
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

console.log("Feature 7: Number of products indicator");
// const renderIndicators = pagination => {
//   const {count} = pagination;
//   spanNbProducts.innerHTML = count;
// };

console.log("Feature 8: Number of recent products indicator");
// const renderIndicatorsRecentProducts = products => {
//   const nbRecentProducts = products.filter(product => { return new Date(product.released) > Date.now() - (1000 * 60 * 60 * 24 * 14 )}).length;
//   spanNbRecentProducts.innerHTML = nbRecentProducts;
// };

console.log("Feature 9: p50, p90 and p95 price value indicator");
// const renderPriceValueIndicator = products => {
//   const sortedProducts = products.sort((a,b) => (a.price>b.price)? 1 :-1)
//   var p50 = Math.floor(sortedProducts.length*0.5);
//   var p90 = Math.floor(sortedProducts.length*0.9);
//   var p95 = Math.floor(sortedProducts.length*0.95);
//   spanP50.innerHTML = sortedProducts[p50].price;
//   spanP90.innerHTML = sortedProducts[p90].price;
//   spanP95.innerHTML = sortedProducts[p95].price;
// };

console.log("Feature 10: Last released date indicator");
// const renderIndicatorsLastReleased = products => {
//   const lastReleasedDate = products.sort((a,b) => {
//     if (new Date(a.date) > new Date(b.date)) return -1;
//     if (new Date(a.date) < new Date(b.date)) return 1;
//     else return 0;
//   });
//   spanLastReleased.innerHTML = lastReleasedDate[0].released;
// };

console.log("Feature 11: Open product link");
console.log("Feature 12: Save as favourite");
function favoriteProduct(checkbox, product){ 
  var jsonStringifyProduct = JSON.stringify(product)
  if (checkbox.checked === true)
    {favoriteList.push(jsonStringifyProduct)}
  else{ 
    var index = favoriteList.indexOf(jsonStringifyProduct);
    if (index !== -1) 
      {favoriteList.splice(index, 1);}
  }
  console.log(favoriteList)
  localStorage.setItem('User_Favorite_Brand',  JSON.stringify(favoriteList));
}



selectFavorite.addEventListener('change', async event => {
  selectRecent.checked=false;
  selectReasonable.checked=false;
  selectSort.value="default";
  
  if (event.target.checked === true){ 
    var favoriteListJSON = favoriteList.map(product => {return JSON.parse(product)});
    //renderProducts(favoriteListJSON);
    const favoritePagination = JSON.parse(JSON.stringify(currentPagination));
    favoritePagination.currentPage = 1;
    favoritePagination.count = favoriteListJSON.length
    render(favoriteListJSON, favoritePagination);
  }
  else{
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  } 
})







document.addEventListener('DOMContentLoaded', async () => {
const products = await fetchProducts();
setCurrentProducts(products);
render(currentProducts, currentPagination);
});
