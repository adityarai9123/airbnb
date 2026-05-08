const express=require('express');
const storeRouter=express.Router();


const storeController=require('../controllers/storeController');

storeRouter.get("/",storeController.getIndex);
storeRouter.get("/bookings",storeController.getBookings);
storeRouter.get("/favourites",storeController.getFavouriteList);
storeRouter.get("/homes",storeController.getHomes);

module.exports=storeRouter;