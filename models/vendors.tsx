const { urlencoded } = require("express");
const daoVendor = require("../daos/vendors.tsx");
const utilSecurity = require("../util/security.tsx");

var ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  editVendorPage,
  getVendorPage,
  getVendorbyUserID,
  getVendorByName,
  addVendorReview,
  deleteReview,
  getReviewsByUser,
  getVendorNames,
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

async function getVendorbyUserID(userID) {
  const userObjectId = new ObjectId(userID);

  const vendor = await daoVendor.findOne({ UserID: userID }); //return vendor details as object
  if (!vendor) {
    return { success: false, error: "Vendor not found" };
  }
  return { success: true, data: vendor };
}

async function getVendorByName(vendorname) {
  const vendor = await daoVendor.findOne({ Name: vendorname }); //return vendor details as object
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

async function deleteReview(reviewid) {
  console.log("deleteReview model", reviewid);
  const reviewObjectId = new ObjectId(reviewid);
  try {
    // access embedded reviews collection
    await daoVendor.updateOne(
      { "reviews._id": reviewObjectId }, // Match the specific review by its ObjectId
      { $pull: { reviews: { _id: reviewObjectId } } } // Remove the review from the reviews array
    );

    return { success: true };
  } catch (error) {
    console.error("Error in getting reviews by user:", error);
    return { success: false, error };
  }
}

async function getReviewsByUser(userid) {
  console.log("getReviewsByUser model input", userid);
  try {
    // Access embedded reviews collection and select only _id and reviews
    const userReviews = await daoVendor.find({}, { _id: 1, reviews: 1 });
    console.log("Combined reviews by vendor", userReviews);

    const userReviewsArray = [];
    const userObjectId = new ObjectId(userid);
    console.log("userObjectId", userObjectId);

    // Loop through each vendor to find reviews by the user
    for (const vendor of userReviews) {
      const vendorDetails = await getVendorPage(vendor._id); // Get the vendor details
      console.log("vendorDetails", vendorDetails);

      vendor.reviews.forEach((review) => {
        console.log("review.user", review.user);
        if (review.user.equals(userObjectId)) {
          userReviewsArray.push({
            review,
            vendorName: vendorDetails.data.Name,
          }); // Associate review with vendorName
        }
      });
    }

    console.log("User reviews array", userReviewsArray);
    return { success: true, userReviewsArray };
  } catch (error) {
    console.error("Error in getting reviews by user:", error);
    return { success: false, error };
  }
}

async function getVendorNames() {
  const vendors = await daoVendor.find({}, { Name: 1 }); //returns array of vendor names
  return { success: true, data: vendors };
}
