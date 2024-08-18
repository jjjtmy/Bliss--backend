const { urlencoded } = require("express");
const daoVendor = require("../daos/vendors.tsx");
const utilSecurity = require("../util/security.tsx");

var ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  editVendorPage,
  getVendorPage,
  addVendorReview,
  getReviewsByUser,
};

async function editVendorPage(newVendorPage) {
  try {
    let name = newVendorPage.Name;

    let vendorPage = await daoVendor.findOne({ Name: name });
    if (!vendorPage) {
      vendorPage = await daoVendor.create(newVendorPage);
      return { success: true };
    } else {
      vendorPage = await daoVendor.updateOne({ Name: name }, newVendorPage);
      return { success: true };
    }
  } catch (error) {
    console.error("Error in editing vendorpage:", error);
    return { success: false, error };
  }
}

async function getVendorPage(vendorID) {
  const vendorObjectId = new ObjectId(vendorID);

  const vendor = await daoVendor.findOne({ _id: vendorObjectId }); //return vendor details as object
  if (!vendor) {
    return { success: false, error: "Vendor not found" };
  }
  return { success: true, data: vendor };
}

async function addVendorReview(review) {
  const vendor = await daoVendor.findOne({ Name: review.Venue });
  if (!vendor) {
    return { success: false, error: "Vendor not found" };
  }

  try {
    vendor.reviews.push(review);
    await vendor.save();
    return { success: true };
  } catch (error) {
    console.error("Error in adding review:", error);
    return { success: false, error };
  }
}

async function getReviewsByUser(userid) {
  console.log("getReviewsByUser model input ", userid);
  try {
    // access embedded reviews collection
    const userReviews = await daoVendor.find({}, { _id: 1 }).select("reviews"); //returns array of object with _id and reviews
    console.log("combined", userReviews);
    console.log("getReviewsByUser model output", userReviews[0].reviews);
    let vendorID = userReviews[0]._id;
    let userReviewsArray = userReviews[0].reviews;

    // filter reviews by user
    userReviewsArray = userReviewsArray.filter(
      (review) => review.user.toString() === userid
    );
    return { success: true, userReviewsArray, vendorID };
  } catch (error) {
    console.error("Error in getting reviews by user:", error);
    return { success: false, error };
  }
}
