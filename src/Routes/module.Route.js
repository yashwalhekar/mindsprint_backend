const express = require("express");
const { getModules } = require("../Controllers/moduleController");
const { getAllLessons } = require("../Controllers/lectureController");

const router = express.Router();


router.get(`/course/:course_id/modules`,getModules)
router.get(`/course/:course_id/modules/:module_id/lessons`,getAllLessons)

module.exports =router