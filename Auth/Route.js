const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("./Auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update); // We use put() instead of post like with login and register. put is restricted to create or update operations while POST is not limited
router.route("/deleteUser").delete(deleteUser);
module.exports = router;