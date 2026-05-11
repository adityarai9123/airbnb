const path = require("path");
const rootDir = require("../utils/pathUtil");
const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");

exports.guestOnly = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  if (req.session.user.userType !== "guest") {
    return res.redirect("/host/host-home-list");
  }
  next();
};

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getBookings = async (req, res, next) => {
  const guestId = req.session.user._id;
  const bookings = await Booking.find({ guest: guestId })
    .populate("home")
    .sort({ checkIn: -1 });
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    bookings,
  });
};

exports.getBookingPage = async (req, res, next) => {
  const homeId = req.params.homeId;
  try {
    const home = await Home.findById(homeId).populate("host", "firstName lastName email");
    if (!home) {
      return res.redirect("/homes");
    }
    const similarHomes = await Home.find({ _id: { $ne: home._id } })
      .limit(3)
      .populate("host", "firstName lastName");
    const maxGuests = home.maxGuests != null ? home.maxGuests : 4;
    const discountPercent =
      home.discountPercent != null ? home.discountPercent : 0;
    const minCheckIn = new Date().toISOString().slice(0, 10);
    res.render("store/book-home", {
      pageTitle: `Book · ${home.houseName}`,
      currentPage: "book",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      home,
      similarHomes,
      maxGuests,
      discountPercent,
      minCheckIn,
      bookingError: null,
    });
  } catch (err) {
    res.redirect("/homes");
  }
};

exports.postBooking = async (req, res, next) => {
  const homeId = req.params.homeId;
  const { checkIn, checkOut } = req.body;
  const guestId = req.session.user._id;

  const renderError = async (message) => {
    const home = await Home.findById(homeId).populate("host", "firstName lastName email");
    if (!home) {
      return res.redirect("/homes");
    }
    const similarHomes = await Home.find({ _id: { $ne: home._id } })
      .limit(3)
      .populate("host", "firstName lastName");
    const maxGuests = home.maxGuests != null ? home.maxGuests : 4;
    const discountPercent =
      home.discountPercent != null ? home.discountPercent : 0;
    const minCheckIn = new Date().toISOString().slice(0, 10);
    return res.status(422).render("store/book-home", {
      pageTitle: `Book · ${home.houseName}`,
      currentPage: "book",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      home,
      similarHomes,
      maxGuests,
      discountPercent,
      minCheckIn,
      bookingError: message,
    });
  };

  try {
    const home = await Home.findById(homeId);
    if (!home) {
      return res.redirect("/homes");
    }

    if (!checkIn || !checkOut) {
      return await renderError("Please choose both check-in and check-out dates.");
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return await renderError("Invalid dates.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return await renderError("Check-in cannot be in the past.");
    }
    if (end <= start) {
      return await renderError("Check-out must be after check-in.");
    }

    const nightMs = 1000 * 60 * 60 * 24;
    const nights = Math.round((end - start) / nightMs);
    if (nights < 1) {
      return await renderError("Stay must be at least one night.");
    }

    const pricePerNight = Number(home.price);
    if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
      return await renderError("This listing has an invalid price.");
    }

    const discount =
      home.discountPercent != null ? home.discountPercent : 0;
    const baseTotal = nights * pricePerNight;
    const savings = Math.round((baseTotal * discount) / 100);
    const totalPrice = Math.round(baseTotal - savings);

    const booking = new Booking({
      guest: guestId,
      home: home._id,
      checkIn: start,
      checkOut: end,
      nights,
      pricePerNight,
      discountPercent: discount,
      totalPrice,
    });
    await booking.save();
    res.redirect("/bookings");
  } catch (err) {
    return await renderError("Something went wrong. Please try again.");
  }
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};

exports.getHouseRules = [
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  },
  (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then((home) => {
      if (!home || !home.rules) {
        return res.status(404).send("Rules not found");
      }
      const filePath = path.join(rootDir, 'rules', home.rules);
      res.download(filePath, 'House Rules.pdf');
    }).catch(err => {
      res.status(500).send("Error fetching rules");
    });
  }
];