const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const { addUserNotes, getALLUserNotes } = require("../Controllers/notes.Controller");


const router  = express.Router();

router.post(`/course/:course_id/modules/:module_id/lessons/:lesson_id/usernotes`,authMiddleware, addUserNotes)
router.get("/course/:course_id/modules/:module_id/lessons/:lesson_id/viewnotes", authMiddleware, getALLUserNotes)


module.exports = router;