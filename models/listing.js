

//   Listing ko ek Mongoose model bana rahe hain, jisme listingSchema ki structure ko follow kiya jayega.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          : v,
    },
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});


// ab mai chahta hu ki ager listing ko delet karu toh uska ander jo v reviews hai sb delet hona chaheya. usi k liya ya code likh raha hu
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;