const path=require('path');

const express=require('express');
const hostRouter=express.Router();
const rootDir=require("../utils/pathUtil");

hostRouter.get("/add-home",(req,res,next)=>{
  res.render('addHome',{pageTitle:'Add Home to airbnb'});
});

const registeredHomes=[];

hostRouter.post("/add-home",(req,res,next)=>{
  console.log("Home Registration Successful for : ",req.body , req.body.houseName);
  registeredHomes.push({houseName:req.body.houseName});
  res.render('HomeAdded',{pageTitle: 'Home Added Suucessfully'});
});


exports.hostRouter=hostRouter;
exports.registeredHomes=registeredHomes;