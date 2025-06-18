const express = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {  reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview); // "Listing ke andar jo 'reviews' naam ka array hai, usme ek naya review (ka ObjectId) daal do."

    await newReview.save();
    await listing.save();
    req.flash("success", "New review Created");
    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
