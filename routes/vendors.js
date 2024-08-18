var express = require("express");
var ctrlVendor = require("../controllers/vendors.tsx");
var securityMiddleware = require("../middlewares/security.tsx");

var router = express.Router();

//start with /vendors
router.get("/getVendorNames", ctrlVendor.getVendorNames);
router.get("/getReviewsByUser/:userid", ctrlVendor.getReviewsByUser);
router.get("/name/:vendorname", ctrlVendor.getVendorByName);
router.get("/:vendor", ctrlVendor.getVendorPage);

router.post(
  "/editvendorpage",
  securityMiddleware.checkVendorPermission,
  ctrlVendor.editVendorPage
);

router.post(
  "/addreview",
  securityMiddleware.checkClientPermission,
  ctrlVendor.addVendorReview
);

module.exports = router;
