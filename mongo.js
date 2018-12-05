const mongo = require("mongodb").MongoClient;

let db;

const mongoConnect = async () => {
  try {
    const client = await mongo.connect(
      "mongodb://localhost:27017/blog_everyone",
      { useNewUrlParser: true }
    );
    db = client.db();

    return db;
  } catch (error) {
    throw error;
  }
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw "NO database found";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
