require('dotenv').config({path:"server/.env"});
const {MongoClient} = require('mongodb');

//MongoDB Details
const MONGODB_DB_NAME = 'WepApp-MongoDB';
const MONGODB_COLLECTION = 'clear-fashion';
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
        client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,});
        database = client.db(MONGODB_DB_NAME);
        console.log("🟢|Connection Success!!!\n");
        return database;

    } catch(error) {
        console.error('❌|Error: MongoDB Connection Failed...');
        console.error(error);
        console.error("__________________________________________________________________________________");
        return null;
    }
};

//------------------------------------------ MongoDB INSERTION --------------------------------------------//
/**
 * MongoDB Database Insertion
 * @param  {Array}  products
 * @return {Object}
 */
 module.exports.mongoInsert = async (products,db) => {
    try {
        console.log("🧩|Start of Database Filling|🧩");
        const collection = db.collection(MONGODB_COLLECTION);
        const result = await collection.insertMany(products, {'ordered': true});
        console.log("📗|Database Filling Completed!!!");
        console.log(`---Total Insertion: ${result.insertedCount} ---\n`);
        return result;

    } catch (error) {
        console.error('❌|Error: MongoDB Insertion Failed...');
        console.error(`🔴|Total Insertion: ${error.result.nInserted}`);
        console.error("__________________________________________________________________________________");
        console.error(error);
        return null;
    }
};

//--------------------------------------------- MongoDB QUERY ---------------------------------------------//
/**
 * MongoDB Query
 * @param {Array} query
 * @return {Array}
 */
module.exports.mongoQuery = async (query,db) => {
    try {
        console.log("💲|Start Query|💲");
        const collection = db.collection(MONGODB_COLLECTION);
        const products = await collection.find(query).toArray();
        console.log("👕|Query Completed!!!");
        console.log("---Response of the Query:---");
        console.log(products);
        console.log("____________________________________________________________________________________");
        return products;  
    } catch (error) {
        console.error('❌|Error: MongoDB Query Failed...');
        console.error("__________________________________________________________________________________");
        console.error(error);
        return null;
    }
};
module.exports.mongoQueryCount = async (query,db) => {
    try {
        console.log("💲|Start Query|💲");
        const collection = db.collection(MONGODB_COLLECTION);
        const countProducts = await collection.count(query);
        console.log("👕|Query Completed!!!");
        console.log("---Response of the Query:---");
        console.log(countProducts);
        console.log("____________________________________________________________________________________");
        return countProducts;  
    } catch (error) {
        console.error('❌|Error: MongoDB Query Failed...');
        console.error("__________________________________________________________________________________");
        console.error(error);
        return null;
    }
};

//--------------------------------------------- MongoDB Close ---------------------------------------------//
/**
 * MongoDB Close Connection
 */
module.exports.mongoClose = async () => {
    try {
        await client.close();
        console.log("\n[End: MongoDB Closed]");
    } catch (error) {
        console.error('❌|Error: MongoDB Closure Failed...');
        console.error(`🔴|Total Insertion: ${error.result.nInserted}`);
        console.error("__________________________________________________________________________________");
        console.error(error);
    }
};