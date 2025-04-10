const express = require("express");
const { enrollUser, getAllEnrollesInfo } = require("../Controllers/enrollment.Controller");


const router = express.Router();

router.post("/enroll", enrollUser);
router.get("/allEnrollments",getAllEnrollesInfo)

module.exports = router;
