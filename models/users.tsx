const { urlencoded } = require("express");
const daoUser = require("../daos/users.tsx");
const utilSecurity = require("../util/security.tsx");

var ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  getUserfromID,
  getUserfromUser,
  getUsers,
  getLoginDetails,
  loginUser,
  createUser,
  logoutUser,
  editUser,
  addToWishlist,
};

function getUserfromID(id) {
  console.log("getUserfromIDmodel req", id);
  return daoUser.findById(id);
}
function getUserfromUser(user) {
  console.log("getUserfromUser req", user);
  return daoUser.find({ name: user });
}

function getUsers(queryFields) {
  console.log("getUsersmodel req", queryFields);
  return daoUser.find(queryFields);
}

async function getLoginDetails(email) {
  console.log("getLoginDetailsmodel req", email);
  const loginFields = {
    _id: 1,
    name: 1,
    salt: 1,
    iterations: 1,
  };
  const loginFieldsRes = await daoUser.findOne({ email: email }, loginFields);
  return { success: true, data: loginFieldsRes };
}

async function loginUser(body) {
  console.log("loginUsermodel req", body);
  if (!body.hasOwnProperty("email")) {
    return { success: false, error: "missing email" };
  }
  if (!body.hasOwnProperty("password")) {
    return { success: false, error: "missing password" };
  }

  const user = await daoUser.findOne({
    email: body.email,
    password: body.password,
  });
  if (user == null || Object.keys(user).length == 0) {
    return { success: false, error: "Invalid email/password" };
  }

  const jwtPayload = {
    user: user.name,
    email: user.email,
    role: user.role,
  };
  const token = utilSecurity.createJWT(jwtPayload);
  const expiry = utilSecurity.getExpiry(token);
  daoUser.updateOne({ email: body.email }, { token: token, expire_at: expiry });
  return { success: true, data: token };
}

async function logoutUser(body) {
  console.log("logoutUsermodel req", body);
  if (!body.hasOwnProperty("email")) {
    return { success: false, error: "missing email" };
  }
  await daoUser.updateOne(
    { email: body.email },
    { token: null, expire_at: null }
  );
  return { success: true, data: "logout successful!" };
}

async function createUser(body) {
  console.log("createUsermodel req", body);
  const user = await daoUser.findOne({ email: body.email });
  if (user) {
    return { success: false, error: "user already exist" };
  }
  const newUser = await daoUser.create(body);
  return { success: true, data: newUser };
}

async function editUser(body) {
  console.log("editUsermodel req", body);
  const user = await daoUser.findOne({ name: body.name });
  if (!user) {
    return { success: false, error: "user does not exist" };
  }
  const updatedUser = await daoUser.updateOne({ name: body.name }, body);
  console.log("editUsermodel res", updatedUser);
  return { success: true, data: updatedUser };
}

async function addToWishlist(body) {
  console.log("addToWishlistmodel req", body);
  const userObjectId = new ObjectId(body.userID);
  console.log("userObjectId", userObjectId);
  const user = await daoUser.findOne({ _id: userObjectId });
  if (!user) {
    return { success: false, error: "user does not exist" };
  }

  try {
    const vendorObjectId = new ObjectId(body.vendorID); // Convert vendorID to ObjectId
    const vendorExists = user.wishlist.some((item) =>
      item.vendorID.equals(vendorObjectId)
    ); // Use ObjectId comparison

    if (vendorExists) {
      return { success: false, error: "Vendor already in wishlist" };
    }

    user.wishlist.push({ vendorID: vendorObjectId });
    await user.save();
    return { success: true };
  } catch (error) {
    console.error("Error in adding to wishlist:", error);
    return { success: false, error };
  }
}
