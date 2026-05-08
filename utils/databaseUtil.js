const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const MONGO_URL="mongodb://Ad:aditya9123006@ac-pbrr3vc-shard-00-00.vzee3qt.mongodb.net:27017,ac-pbrr3vc-shard-00-01.vzee3qt.mongodb.net:27017,ac-pbrr3vc-shard-00-02.vzee3qt.mongodb.net:27017/?ssl=true&replicaSet=atlas-xcj3sr-shard-0&authSource=admin&appName=Cluster0";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
  .then(client => {
    callback();
    _db = client.db('airbnb');
  }).catch(err => {
    console.log('Error while connecting to Mongo: ', err);
  });
}

const getDB = () => {
  if (!_db) {
    throw new Error('Mongo not connected');
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;