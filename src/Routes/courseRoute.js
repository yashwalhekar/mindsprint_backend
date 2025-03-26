const express = require("express");
const { getCourses, getCourseById } = require("../Controllers/courseController");
const router = express.Router();


router.get("/course",getCourses)
router.get("/course/:id",getCourseById)


module.exports= router;
