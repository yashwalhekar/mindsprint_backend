const express = require("express");
const { enrollUser } = require("../Controllers/enrollment.Controller");


const router = express.Router();

router.post("/enroll", enrollUser);

module.exports = router;
