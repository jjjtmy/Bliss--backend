const mongoose = require("mongoose");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

/*
{
    name: '',
    email: '',
    password: '',
    confirm: '',
}
*/

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    iterations: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
    },
    expire_at: {
      type: Number,
    },
    role: {
      type: String,
      default: "client",
    },
    image_url: {
      type: String,
    },
    wishlist: [
      {
        vendorID: Schema.Types.ObjectId,
        ownComments: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compile the schema into a model and export it
// highlight-next-line
module.exports = mongoose.model("User", userSchema);
