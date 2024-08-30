var express = require("express");
var userController = require("../controllers/users.tsx");
var securityMiddleware = require("../middlewares/security.tsx");
var router = express.Router();

// login - get loginDetails first then loginUser
router.get("/loginDetails", userController.getLoginDetails);
router.post("/login", userController.loginUser);
// logout
router.post(
  "/logout",
  securityMiddleware.checkPermission,
  userController.logoutUser
);
// sign up
router.post("/create", userController.createUser);

//edit user
router.post("/edit", userController.editUser);
//add wishlist
router.post("/addToWishlist", userController.addToWishlist);
router.post("/updateComment", userController.updateComment);
//deletewishlist
router.post("/deleteWishlistItem", userController.deleteWishlistItem);

// get user (by id) or all users
router.get("/userid/:userid", userController.getUserfromID);
router.get("/user/:user", userController.getUserfromUser);
router.get("/", securityMiddleware.checkPermission, userController.getUsers);

module.exports = router;
