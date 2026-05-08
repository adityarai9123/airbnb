const path=require('path');

//External module
const express=require('express');

//local module
const storeRouter=require('./routes/storeRouter');
const hostRouter=require('./routes/hostRouter');
const rootDir = require('./utils/pathUtil');
const errorsController=require('./controllers/errors');

const app=express();

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host",hostRouter);

app.use(express.static(path.join(rootDir,'public')));

app.use(errorsController.get404);

const PORT=3003;
app.listen(PORT,()=>{
  console.log(`Server running on address http://localhost:${PORT}`);
});