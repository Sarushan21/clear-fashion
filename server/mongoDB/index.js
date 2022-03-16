require('dotenv').config({path:"server/.env"});
const {MongoClient} = require('mongodb');

//MongoDB Details
const MONGODB_DB_NAME = 'WepApp-MongoDB';
const MONGODB_COLLECTION = 'dedicatedBrand';
const MONGODB_URI = process.env.MONGODB_URI;

var client = null;
var database = null;


//------------------------------------------ MongoDB CONNECTION -------------------------------------------//
/**
 * MongoDB Database Connection
 * @type {MongoClient}
 */
module.exports.mongoConnection = async () => {
    try {
        if(database){
            console.log(`🟢|Already Connected to ${MONGODB_DB_NAME}!\n`);
            return database; }

        console.log(`🍃|Connection... ${MONGODB_DB_NAME}|🍃`);
        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        database = client.db(MONGODB_DB_NAME);
        console.log("🟢|Connection Success!!!\n");
        return database;

    } catch(error) {
        console.error('❌|Connection Failed...');
        console.error(error);
        console.error("__________________________________________________________________________________")
        return null;
    }
};

//------------------------------------------ MongoDB INSERTION --------------------------------------------//
/**
 * MongoDB Database Insertion
 * @param  {Array}  products
 * @return {Object}
 */
 module.exports.mongoInsert = async products => {
    try {
        const db = await mongoConnection();
        const collection = db.collection(MONGODB_COLLECTION);
        const result = await collection.insertMany(products, {'ordered': true});
        return result;

    } catch (error) {
        console.error(`🔴|Total Insertion: ${error.result.nInserted}...`);
        console.error(error);
        console.error('❌|Insertion Failed...');
        console.error("__________________________________________________________________________________");
        return null;
    }
};

//------------------------------------------ MongoDB QUERY ------------------------------------------------//
/**
 * MongoDB Query
 * @param {Array} query
 * @return {Array}
 */
module.exports.mongoQuery = async query => {
    try {
        const db = await mongoConnection();
        const collection = db.collection(MONGODB_COLLECTION);
        const products = await collection.find(query).toArray();
        console.log(products)
        return products;
  
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};
  
/**
 * Close the connection
 */
module.exports.close = async () => {
    try {
        await client.close();
    } catch (error) {
        console.error('🚨 MongoClient.close...', error);
    }
};
  