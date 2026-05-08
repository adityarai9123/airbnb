// Core Module
const path = require('path');

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.get404);

const PORT = 3000;
const DB_PATH = 'mongodb://Ad:aditya9123006@ac-pbrr3vc-shard-00-00.vzee3qt.mongodb.net:27017,ac-pbrr3vc-shard-00-01.vzee3qt.mongodb.net:27017,ac-pbrr3vc-shard-00-02.vzee3qt.mongodb.net:27017/airbnb?ssl=true&replicaSet=atlas-xcj3sr-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});