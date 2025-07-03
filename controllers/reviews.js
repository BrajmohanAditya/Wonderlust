const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview); // "Listing ke andar jo 'reviews' naam ka array hai, usme ek naya review (ka ObjectId) daal do."

    await newReview.save();
    await listing.save();
    req.flash("success", "New review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "New review Deleted");
  res.redirect(`/listings/${id}`);
};