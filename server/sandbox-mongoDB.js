const db = require('./mongoDB');
const sandbox = require("./sandbox");

async function sandboxMongoDB(){
    const dedicatedBrandProducts = await sandbox.sandbox();
    const montlimartProducts = await sandbox.sandbox(eshop="https://www.montlimart.com/", shopname="montlimart");
    const adresseParisProducts = await sandbox.sandbox(eshop="https://adresse.paris/", shopname="adresseParis");
    /*website = [
        {"eshop":"https://www.dedicatedbrand.com/en/loadfilter?", "shopname":"dedicatedbrand"},
        {"eshop":"https://www.montlimart.com/", "shopname":"montlimart"},
        {"eshop":"https://adresse.paris/", "shopname":"adresseParis"}];
    */

    console.log(dedicatedBrandProducts)
    const database = await db.mongoConnection();
    const insertDedicated = await db.mongoInsert(dedicatedBrandProducts, database);
    const insertMonlimart = await db.mongoInsert(montlimartProducts, database);
    const insertAdresseParis = await db.mongoInsert(adresseParisProducts, database);

    await db.mongoClose();
    console.log("🍂|MongoDB: Closed|🍂")
}

sandboxMongoDB()