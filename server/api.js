const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./mongoDB');
require('dotenv').config();

const PORT = 8092;
const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());



var client = null;
var database = null;

const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'WepApp-MongoDB';
const MONGODB_COLLECTION = 'test';
const MONGODB_URI = process.env.MONGODB_URI;


/////////////////////////////////////////
app.get('/', (request, response) => {
  response.send({'ack': true, "test":false});
});

app.get('/products', async (request, response) => {
  //client.connect( async (err) => {
  //  var id =request.params.id;
  //  console.log("connected")
  //  const test = await collection.find({}).toArray();
    //console.log(test);
  //  response.send(test);
  //});
  client = await MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  database = client.db(MONGODB_DB_NAME);
  const products = await db.mongoQuery({},database);
  console.log(products)
  response.send(products)
});

app.get('/products/find', async (request, response) => {
  //const database = await db.mongoConnection();
  client = await MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  database = client.db(MONGODB_DB_NAME);
  const collection = database.collection(MONGODB_COLLECTION);
  
  const { calculateLimitAndOffset, paginate } = require('paginate-info');
  var currentPage = parseInt(request.query.currentPage);
  var pageLimit = parseInt(request.query.pageLimit);
  console.log(request.query);
  console.log(currentPage);
  console.log(pageLimit);

  const {limit, offset} = calculateLimitAndOffset(currentPage, pageLimit);
  const count = await collection.count({});
  const rows = await collection.find({}).skip(offset).limit(limit).toArray();

  console.log(count)
  console.log(rows)
  var meta = paginate(currentPage, count, rows, pageLimit )
  console.log(meta)

  const result={"sucess":true, "data":{"result":rows,"meta":meta}}
  response.send(result)
});


app.get('/products/search', async (request, response) => {
  console.log(request)
  const products = await db.mongoQuery({});
  response.send(products)
});

app.get('/products/:id', async (request, response) => {
  client = await MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true,useNewUrlParser: true});
  database = client.db(MONGODB_DB_NAME);
  const product = await db.mongoQuery({'_id':request.params.id},database);
  response.send(product)
});



app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);