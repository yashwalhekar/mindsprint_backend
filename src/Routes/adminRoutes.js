const express = require("express");
const { getAllUsers, updateUserRole, deleteUser, getAllAdmins, addNewUser, addNewCourse, getCourses, updateUserStatus, removeCourse, getCourseByid, addnewModules, deleteModule, addLessons, deleteLessons, getAllModules, getAllLessons, updateCourseStatus, addNotes, getAllNotesAdmin } = require("../Controllers/adminController");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");


const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.post("/addUser", authMiddleware, adminMiddleware, addNewUser);
router.get("/adminUsers", authMiddleware,adminMiddleware,getAllAdmins)
router.put("/update-role", authMiddleware, adminMiddleware, updateUserRole);
router.patch("/update-status", authMiddleware, adminMiddleware, updateUserStatus);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);
router.post("/addCourse",authMiddleware,adminMiddleware,addNewCourse);
router.get("/getCourses",authMiddleware,adminMiddleware,getCourses);
router.patch("/update-course", authMiddleware,adminMiddleware,updateCourseStatus)
router.delete("/remove/:id",authMiddleware,adminMiddleware,removeCourse);
router.get("/course/:id", authMiddleware,adminMiddleware,getCourseByid)

router.get("/course/:course_id/module",authMiddleware,adminMiddleware,getAllModules)
router.post("/course/:course_id/module",authMiddleware,adminMiddleware,addnewModules);
router.delete("/course/:course_id/module/:module_id", authMiddleware, adminMiddleware, deleteModule);

router.get("/course/:course_id/module/:module_id/lecture",authMiddleware,adminMiddleware,getAllLessons);
router.post("/course/:course_id/module/:module_id/lecture",authMiddleware,adminMiddleware,addLessons);
router.delete("/course/:course_id/module/:module_id/lecture/:lesson_id",authMiddleware,adminMiddleware,deleteLessons);


router.post("/course/:course_id/module/:module_id/lecture/:lesson_id/notes", authMiddleware, adminMiddleware, addNotes);
router.get("/course/:course_id/module/:module_id/lecture/:lesson_id/view_notes", authMiddleware,getAllNotesAdmin)



module.exports = router;
