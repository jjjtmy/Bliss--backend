const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      default: null,
    },
    Location: {
      type: String,
      required: true,
      default: null,
    },
    Email: {
      type: String,
      required: true,
      default: null,
    },
    Phone: {
      type: String,
      required: true,
      default: null,
    },
    Description: {
      type: String,
      required: true,
      default: null,
    },
    MinCap: {
      type: Number,
    },
    MaxCap: {
      type: Number,
      default: null,
    },
    MinPrice: {
      type: Number,
      default: null,
    },
    MaxPrice: {
      type: Number,
      default: null,
    },
    reviews: [
      {
        user: Schema.Types.ObjectId,
        username: String,
        costperpax: Number,
        food: Number,
        ambience: Number,
        preWeddingSupport: Number,
        dayOfSupport: Number,
        overall: Number,
        comments: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compile the schema into a model and export it
// highlight-next-line
module.exports = mongoose.model("Vendor", vendorSchema);
