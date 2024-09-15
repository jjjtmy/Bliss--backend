const { urlencoded } = require("express");
const daoVendor = require("../daos/vendors.tsx");
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
  console.log("addVendorReview model review", review);
  console.log("addVendorReview model vendor", vendor);
  if (!vendor) {
    return { success: false, error: "Vendor not found" };
  }

  try {
    vendor.reviews.push(review);
    // console.log("addVendorReview model vendor.reviews", vendor.reviews);
    await updateFoodRating(vendor._id);
    await updateAmbienceRating(vendor._id);
    await updatePreWeddingSupportRating(vendor._id);
    await updateDayOfSupportRating(vendor._id);
    await updateOverallRating(vendor._id);
    // console.log("updateFoodRating model vendor", vendor);
    await vendor.save();
    return { success: true };
  } catch (error) {
    console.error("Error in adding review:", error);
    return { success: false, error };
  }
}

async function updateFoodRating(vendorID) {
  try {
    const vendor = await daoVendor.findOne({ _id: vendorID });
    let totalFoodRating = 0;
    let count = 0;
    for (let review of vendor.reviews) {
      if (review.food !== undefined) {
        // Ensure the food rating exists
        totalFoodRating += review.food;
        count++;
      }
    }
    let newFoodRating = count > 0 ? totalFoodRating / count : 0;
    // console.log("newFoodRating", newFoodRating);
    newFoodRating = Math.round(newFoodRating * 10) / 10;
    vendor.foodRating = newFoodRating;
    await vendor.save(); // Save the updated vendor back to the database
    return { success: true, foodRating: newFoodRating };
  } catch (error) {
    console.error("Error in updating food rating:", error);
    return { success: false, error };
  }
}

async function updateAmbienceRating(vendorID) {
  try {
    const vendor = await daoVendor.findOne({ _id: vendorID });
    let totalAmbienceRating = 0;
    let count = 0;
    for (let review of vendor.reviews) {
      if (review.ambience !== undefined) {
        // Ensure the ambience rating exists
        totalAmbienceRating += review.ambience;
        count++;
      }
    }
    let newAmbienceRating = count > 0 ? totalAmbienceRating / count : 0;
    // console.log("newAmbienceRating", newAmbienceRating);
    newAmbienceRating = Math.round(newAmbienceRating * 10) / 10;
    vendor.ambienceRating = newAmbienceRating;
    await vendor.save(); // Save the updated vendor back to the database
    return { success: true, ambienceRating: newAmbienceRating };
  } catch (error) {
    console.error("Error in updating ambience rating:", error);
    return { success: false, error };
  }
}

async function updatePreWeddingSupportRating(vendorID) {
  try {
    const vendor = await daoVendor.findOne({ _id: vendorID });
    let totalPreWeddingSupportRating = 0;
    let count = 0;
    for (let review of vendor.reviews) {
      if (review.preWeddingSupport !== undefined) {
        // Ensure the pre-wedding support rating exists
        totalPreWeddingSupportRating += review.preWeddingSupport;
        count++;
      }
    }
    let newPreWeddingSupportRating =
      count > 0 ? totalPreWeddingSupportRating / count : 0;
    // console.log("newPreWeddingSupportRating", newPreWeddingSupportRating);
    newPreWeddingSupportRating =
      Math.round(newPreWeddingSupportRating * 10) / 10;
    vendor.preWeddingSupportRating = newPreWeddingSupportRating;
    await vendor.save(); // Save the updated vendor back to the database
    return {
      success: true,
      preWeddingSupportRating: newPreWeddingSupportRating,
    };
  } catch (error) {
    console.error("Error in updating pre-wedding support rating:", error);
    return { success: false, error };
  }
}

async function updateDayOfSupportRating(vendorID) {
  try {
    const vendor = await daoVendor.findOne({
      _id: vendorID,
    });
    let totalDayOfSupportRating = 0;
    let count = 0;
    for (let review of vendor.reviews) {
      if (review.dayOfSupport !== undefined) {
        // Ensure the day-of support rating exists
        totalDayOfSupportRating += review.dayOfSupport;
        count++;
      }
    }
    let newDayOfSupportRating = count > 0 ? totalDayOfSupportRating / count : 0;
    newDayOfSupportRating = Math.round(newDayOfSupportRating * 10) / 10;
    // console.log("newDayOfSupportRating", newDayOfSupportRating);
    vendor.dayOfSupportRating = newDayOfSupportRating;
    await vendor.save(); // Save the updated vendor back to the database
    return { success: true, dayOfSupportRating: newDayOfSupportRating };
  } catch (error) {
    console.error("Error in updating day-of support rating:", error);
    return { success: false, error };
  }
}

async function updateOverallRating(vendorID) {
  try {
    const vendor = await daoVendor.findOne({
      _id: vendorID,
    });
    let totalOverallRating = 0;
    let count = 0;

    for (let review of vendor.reviews) {
      if (review.overall !== undefined) {
        // Ensure the overall rating exists
        totalOverallRating += review.overall;
        count++;
      }
    }
    let newOverallRating = count > 0 ? totalOverallRating / count : 0;
    // console.log("newOverallRating", newOverallRating);
    newOverallRating = Math.round(newOverallRating * 10) / 10;
    vendor.overallRating = newOverallRating;
    await vendor.save(); // Save the updated vendor back to the database
    return { success: true, overallRating: newOverallRating };
  } catch (error) {
    console.error("Error in updating overall rating:", error);
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
    // console.log("Combined reviews by vendor", userReviews);

    const userReviewsArray = [];
    const userObjectId = new ObjectId(userid);
    // console.log("userObjectId", userObjectId);

    // Loop through each vendor to find reviews by the user
    for (const vendor of userReviews) {
      const vendorDetails = await getVendorPage(vendor._id); // Get the vendor details
      console.log("vendorDetails", vendorDetails);

      vendor.reviews.forEach((review) => {
        // console.log("review.user", review.user);
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
