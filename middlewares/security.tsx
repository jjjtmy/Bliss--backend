const utilSecurity = require("../util/security.tsx");
const daoUser = require("../daos/users.tsx");

module.exports = {
  checkJWT,
  checkLogin,
  checkPermission,
  checkVendorPermission,
  checkClientPermission,
};

// set req.user
function checkJWT(req, res, next) {
  // Check for the token being sent in a header or as a query parameter

  let token = req.get("Authorization") || req.query.token;
  console.log(token);
  if (token) {
    token = token.replace("Bearer ", "");
    // console.log(token);
    req.user = utilSecurity.verifyJWT(token);
    // console.log(req.user);
  } else {
    // No token was sent
    req.user = null;
  }
  return next();
}

// make use of req.user check if they are login
function checkLogin(req, res, next) {
  // Status code of 401 is Unauthorized
  if (!req.user) return res.status(401).json("Unauthorized");
  // A okay
  next();
}

// make use of req.user check if they are owner or if they are admin
function checkPermission(req, res, next) {
  // Status code of 401 is Unauthorized
  console.log("user", req.user);
  console.log("body", req.body.email);
  if (!req.user) return res.status(401).json("Unauthorized");
  // if you are not the owner and you are not admin -> unauthorized
  if (
    req.body.email != req.user.payload.email &&
    (req.user.role === "client" || req.user.role === "vendor")
  )
    return res.status(401).json("Unauthorized");
  next();
}

// make use of req.user check if they are vendor
function checkVendorPermission(req, res, next) {
  // Status code of 401 is Unauthorized
  console.log("user", req.user);
  console.log("body", req.body);
  // // Check if the user is vendor
  if (req.user.payload.role === "vendor") {
    console.log("this is a vendor");
    return next();
  } else {
    console.log("this is not a vendor");
    return res.status(401).json("Unauthorized");
  }
}

// make use of req.user check if they are vendor
function checkClientPermission(req, res, next) {
  // Status code of 401 is Unauthorized
  console.log("user", req.user);
  console.log("body", req.body);
  // // Check if the user is vendor
  if (req.user.payload.role === "client") {
    console.log("this is a client");
    return next();
  } else {
    console.log("this is not a client");
    return res.status(401).json("Unauthorized");
  }
}
