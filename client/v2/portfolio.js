// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

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
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
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
* Render page selector
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
  console.log(brands);
  const options = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`)
    .join('');
  selectBrand.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
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
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

console.log("Feature 1: Browse pages");
selectPage.addEventListener('change', async event => {
  const products = await fetchProducts(event.target.value, currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

console.log("Feature 2: Filter by brands");
selectBrand.addEventListener('change', async event => {
  if (event.target.value !== "Default"){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    //Filter by brands
    const filterProductsBrands = products.result.filter(product => { return product.brand.includes(event.target.value)});
    //Copy of products objet in order to add modifications
    const newProducts = JSON.parse(JSON.stringify(products));
    newProducts.result = filterProductsBrands;
    setCurrentProducts(newProducts);
    render(newProducts.result, currentPagination);
  }
  else {
    const products = await fetchProducts();   
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

console.log("Feature 3: Filter by recent products");
selectSort.addEventListener('change', async event => {
  if (event.target.value === "date-asc"){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    const filterRecentProducts = products.result.filter(product => { return new Date(product.released) > Date.now() - (1000 * 60 * 60 * 24 * 14) });
    const recentProducts = JSON.parse(JSON.stringify(products));
    for (var elem in filterRecentProducts)
    {
      console.log("Recent Product: ", filterRecentProducts[elem].released);
    }
    recentProducts.result = filterRecentProducts;
    setCurrentProducts(recentProducts);
    render(recentProducts.result, currentPagination);
  }
});

console.log("Feature 4: Filter by reasonable price");
selectSort.addEventListener('change', async event => {
  if (event.target.value === "price-asc"){ 
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    const filterCheaperProducts = products.result.filter(product => { return product.price < 50 });
    const cheaperProducts = JSON.parse(JSON.stringify(products));
    for (var elem in filterCheaperProducts)
    {
      console.log("Cheaper Product: ", filterCheaperProducts[elem].price);
    }
    cheaperProducts.result = filterCheaperProducts;
    setCurrentProducts(cheaperProducts);
    render(cheaperProducts.result, currentPagination);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
const products = await fetchProducts();   
setCurrentProducts(products);
render(currentProducts, currentPagination);
});
