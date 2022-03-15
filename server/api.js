const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const PORT = 8092;
const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true, "test":false});
});

app.get('/products', async (request, response) => {
  const products = await db.find({});
  console.log(products)
  response.send("Hi")
});

app.get('/products2', async (request, response) => {
  const products = await db.find({});
  console.log(products)
  response.send(products)
});

app.get('/products/search', async (request, response) => {
  console.log(request)
  const products = await db.find({});
  response.send(products)
});

app.get('/products/:id', async (request, response) => {
  const product = await db.find({'_id':request.params.id});
  response.send(product)
});



app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
