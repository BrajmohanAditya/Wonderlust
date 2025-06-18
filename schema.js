// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.string().required().min(0),
//     image: Joi.string().allow("", null),
//   }).required(),
// });

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0), // ✅ price as number
    image: Joi.object({
      url: Joi.string().allow("").uri(), // ✅ blank bhi chalega
      filename: Joi.string().allow(""), // ✅ blank bhi chalega
    }).required(),
  }).required(),
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.string().required().min(1).max(5),
    comment: Joi.string().required()
  }).required(),
});

