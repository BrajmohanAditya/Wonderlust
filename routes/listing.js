const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Route No : 1
// app.get("/Listing", async (req, res) => { ... })
// app.set("view engine", "ejs");,   app.set("views", path.join(__dirname, "views"));  ya dono code define krna hoga tabhi necha wala code chalaga
router.get("/", wrapAsync(listingController.index));

// Entry point of this project, call "/Listing" from local host ya DB seh listing meh jo v data hai sb ko layaga or allListing meh store karega
 // Route No: 2
router.get("/new", isLoggedIn, listingController.renderNewForm);

// yaha request,  index.ejs seh k anker tag seh  ayaga, iska liya "url encoded ve import krna para "
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// console.log(req.body);
// Route No: 4   // ya new list add krna ka liya hai
// Pehle req.flash() se message ko session mein store kiya jaata hai, phir middleware ke through usse res.locals mein daal kar view/template mein bheja jaata hai display ke liye.
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// Route no: 5; Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
// Update route , [Route No: 6 ]
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route, [Route No: 7]
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroylisting)
);

module.exports = router;
