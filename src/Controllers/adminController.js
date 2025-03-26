const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAdminUsers,
  addUser,
  addCourse,
  getAllCourse,
  usersStatusUpdate,
  deleteCourse,
  getCourseById,
  addModules,
  getModuleByCourseId,
  deleteModule,
  getAllLectures,
  addLessons,
  deleteLesson,
  getAllModules,
  courseStatusUpdate,
} = require("../Services/adminService");

//___________________USER__________________________________________________________

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNewUser = async (req, res) => {
  try {
    const user = await addUser(req.body);
    // console.log("user",user);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdminUsers();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const response = await updateUserRole(id, role);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteUser(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//______________________COURSE________________________________________________________

exports.addNewCourse = async (req, res) => {
  try {
    const course = await addCourse(req.body);
    // console.log("course",course);

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const response = await getAllCourse();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    console.log("📥 Full Request Body:", req.body);

    const { course_id, status } = req.body;

    if (!course_id) {
      return res.status(400).json({ error: "Missing course_id" });
    }

    console.log("🛠 Updating Course ID:", course_id, "New Status:", status);

    const response = await courseStatusUpdate(course_id, status);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id, is_active } = req.body;
    const response = await usersStatusUpdate(id, is_active);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCourse(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseByid = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getCourseById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//__________________________MODULES_________________________________________________

exports.getAllModules = async (req, res) => {
  try {
    console.log("Received course_id:", req.params);  // Debug to confirm the parameter

    let { course_id } = req.params;

    // Validate and convert course_id to a number
    if (!course_id || isNaN(course_id)) {
      return res.status(400).json({ error: `Invalid course_id: ${course_id}` });
    }

    // Ensure course_id is a number before passing to the service
    course_id = parseInt(course_id, 10); 

    const response = await getAllModules(course_id); 
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error fetching modules:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addnewModules = async (req, res) => {
  try {
    const { title, position } = req.body;
    const { course_id } = req.params; // Extract course_id from URL

    if (!title || !course_id) {
      throw new Error("Please fill required fields.");
    }

    const response = await addModules(title, course_id, position);
    console.log("new module", response);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getModules = async (req, res) => {
  try {
    const { course_id } = req.body;
    const response = await getModuleByCourseId(course_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { course_id, module_id } = req.params; // Extract from params

    if (!course_id || !module_id) {
      return res.status(400).json({ error: "Missing course_id or module_id" });
    }

    const response = await deleteModule(course_id, module_id);
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------LECTURES------------------------------------------------------
exports.getAllLessons = async (req, res) => {
  try {
    const { course_id, module_id } = req.params;
    const response = await getAllLectures(course_id, module_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLessons = async (req, res) => {
  try {
    const { course_id, module_id } = req.params;
    const {
      title,
      content_url,
      content_type,
      duration_minutes,
      isDownloadable,
      position,
    } = req.body;
    console.log("Received request body:", req.body);
    console.log(` module ${module_id} of course ${course_id}`);
    const response = await addLessons({
      module_id, // `course_id` is not needed here unless required in DB
      title,
      content_url,
      content_type,
      duration_minutes,
      isDownloadable,
      position,
    });

    console.log("Lesson added:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLessons = async (req, res) => {
  try {
    const { course_id, module_id, lesson_id } = req.params; // Extract from params

    if (!lesson_id) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    // Optional: Check foreign key constraints
    console.log(
      `Deleting lesson ${lesson_id} in module ${module_id} of course ${course_id}`
    );

    const response = await deleteLesson(lesson_id);

    res.status(200).json({ message: "Lesson deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
