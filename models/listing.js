// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//     type: String,
//     require: true,
//     },
//     description: String,

//     image:{
//     type: String,
//     default: "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY",
//     set:(v) => v === "" ? "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY" : v,
//     } ,


// image: {
//   type: {
//     filename: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//       default: "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY",
//       set: (v) =>
//         v === ""
//           ? "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY"
//           : v,
//     },
//   },
//   required: true,
// },





//     price:{
//         type:Number,
//         required: true,
//         default: 0
//     },
//     location: String,
//     country: String, 
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;
//   Listing ko ek Mongoose model bana rahe hain, jisme listingSchema ki structure ko follow kiya jayega.
/*
schema of a image has been defined, or ager tum neh image dalna he bhool gaya toh ak by default image
generate hoga. if v = null then default link daal doh otherwise v ka value dal doh. 
*/

//   Listing ko ek Mongoose model bana rahe hain, jisme listingSchema ki structure ko follow kiya jayega.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      default: "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY",
      set: (v) =>
        v === "" 
          ? "https://unsplash.com/photos/the-sun-shines-through-the-trees-in-the-forest-OC63XpUAxuY"
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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;