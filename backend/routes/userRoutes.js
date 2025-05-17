const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/getuser/:id", getUserById);
router.post("/create", createUser);
router.put("/updateuser/:id", updateUser);
router.delete("deleteuser/:id", deleteUser);

module.exports = router;
