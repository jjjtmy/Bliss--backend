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

// get user (by id) or all users
router.get("/:user", userController.getUserfromUser);
router.get("/:userid", userController.getUserfromID);

router.get("/", securityMiddleware.checkPermission, userController.getUsers);

module.exports = router;
