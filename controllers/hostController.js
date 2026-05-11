const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description, maxGuests, discountPercent } = req.body;

  if (!req.files || !req.files.photo) {
    return res.status(422).send("No image provided");
  }

  const photo = '/uploads/' + req.files.photo[0].filename;
  const rules = req.files.rules ? req.files.rules[0].filename : null;
  const parsedGuests = parseInt(maxGuests, 10);
  const parsedDiscount = parseInt(discountPercent, 10);

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    rules,
    description,
    host: req.session.user._id,
    maxGuests: Number.isFinite(parsedGuests) && parsedGuests > 0 ? parsedGuests : 4,
    discountPercent:
      Number.isFinite(parsedDiscount) && parsedDiscount >= 0
        ? Math.min(100, parsedDiscount)
        : 0,
  });
  home.save();

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description, maxGuests, discountPercent } =
    req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;
    const parsedGuests = parseInt(maxGuests, 10);
    const parsedDiscount = parseInt(discountPercent, 10);
    if (Number.isFinite(parsedGuests) && parsedGuests > 0) {
      home.maxGuests = parsedGuests;
    }
    if (Number.isFinite(parsedDiscount) && parsedDiscount >= 0) {
      home.discountPercent = Math.min(100, parsedDiscount);
    }
    if (!home.host) {
      home.host = req.session.user._id;
    }
    if (req.files && req.files.photo) {
        if (home.photo && home.photo.startsWith('/uploads/')) {
          fs.unlink('uploads/' + home.photo.split('/uploads/')[1], (err) => {
            // File deletion error handled silently
          });
        }
        home.photo = '/uploads/' + req.files.photo[0].filename;
      }
    if (req.files && req.files.rules) {
        if (home.rules) {
          fs.unlink('rules/' + home.rules, (err) => {
            // File deletion error handled silently
          });
        }
        home.rules = req.files.rules[0].filename;
      }
    home.save();
    res.redirect("/host/host-home-list");
  }).catch(err => {
    res.redirect("/host/host-home-list");
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      res.redirect("/host/host-home-list");
    });
};