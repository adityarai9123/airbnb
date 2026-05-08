//External Modules
const express=require('express');

//Local Module
const userRequestHandler=require('./user');

const app=express();

app.use("/",(req,res,next)=>{
  console.log("Came in the first middlware",req.url,req.method)
  next();
});

app.use("/submit-details",(req,res,next)=>{
  console.log("Came in the second middlware",req.url,req.method);
  res.send("<p>Just fulfill your parents dream they don't want you to lose in your life so study hard and make that dream come true, all the best adi!</p>");
});

const PORT=3002;
app.listen(PORT,()=>{
  console.log(`Server running on address http://localhost:${PORT}`);
});

 