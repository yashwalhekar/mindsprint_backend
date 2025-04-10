const { getCourseByTitle } = require("../Models/Course.Model");
const userModel = require("../Models/User.Model");
const bcrypt = require("bcryptjs");
const courseModel = require("../Models/Course.Model");
const moduleModel = require("../Models/modules.model");
const lectureModel = require("../Models/lectures.Model");
const notesModel = require("../Models/notes.Model");
const addUser = async (userData) => {
  const {
    first_name,
    last_name,
    dob,
    email,
    password,
    phone,
    address,
    city,
    state,
    country,
    school,
  } = userData;

  // Validate required fields
  if (
    !first_name ||
    !last_name ||
    !dob ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !country ||
    !school
  ) {
    throw new Error("Missing Required fields");
  }

  // Check if user already exists
  const existingUser = await userModel.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists...");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = `USR_${Date.now()}`;

  // Insert user into the database
  await userModel.createUser({
    user_id,
    first_name,
    last_name,
    dob,
    email,
    password: hashedPassword,
    phone,
    address,
    city,
    state,
    country,
    school,
    role: "user", // Default role is 'user'
  });

  // Retrieve the newly created user from the database
  const newUser = await userModel.getUserByEmail(email);

  // Exclude the password before returning the response
  return {
    user_id: newUser.user_id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    dob: newUser.dob,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    city: newUser.city,
    state: newUser.state,
    country: newUser.country,
    school: newUser.school,
    role: newUser.role,
  };
};

const getAllUsers = async () => {
  return await userModel.getAllUsers();
};

const getAllAdminUsers = async () => {
  return await userModel.getAllAdminUsers();
};

const updateUserRole = async (id, role) => {
  const validRoles = ["user", "sub-admin", "admin"];
  if (!validRoles.includes(role)) throw new Error("Invalid role");

  await userModel.updateUserRole(id, role);
  return { message: "User role updated successfully" };
};

const deleteUser = async (id) => {
  await userModel.deleteUser(id);
  return { message: "User deleted successfully" };
};

const usersStatusUpdate = async (user_id, status) => {
  if (!user_id) {
    throw new Error("User id is required!!");
  }
  await userModel.updateStatus(user_id, status);
  return { message: "User status updated successfully" };
};

//____________________________Courses_____________________________________________

const addCourse = async (courseData) => {
  const {
    title,
    description,
    category,
    subcategory,
    tags,
    level,
    language,
    duration_hours,
    image_url,
    promo_video_url,
    video_url,
    price,
    rating,
    instructor_id,
    status,
    prerequisites,
    creator,
  } = courseData;

  // Validate required fields
  if (
    !title ||
    !description ||
    !category ||
    !level ||
    !language ||
    !duration_hours
  ) {
    throw new Error("Please fill required Fields..");
  }

  // Check if course already exists
  const courseExists = await getCourseByTitle(title);
  if (courseExists) {
    throw new Error("Course already exists..!!");
  }

  // Create the course
  const newCourse = await courseModel.createCourse({
    title,
    description,
    category,
    subcategory,
    tags,
    level,
    language,
    duration_hours,
    image_url,
    promo_video_url,
    video_url,
    price,
    rating,
    instructor_id,
    status,
    prerequisites,
    creator,
  });

  // Return the newly created course
  return newCourse;
};

const getAllCourse = async () => {
  return await courseModel.getAllCourses();
};

const courseStatusUpdate = async (id, status) => {
  if (!id) {
    throw new Error("Course id not found!!");
  }
  await courseModel.updateStatus(id, status);
  return { message: "Course status updated successfully" };
};

const deleteCourse = async (id) => {
  if (!id) {
    throw new Error("course id is required!!");
  }
  await courseModel.deleteCourseById(id);
  return { message: "Course Deleted Successfully..." };
};

const getCourseById = async (id) => {
  if (!id) {
    throw new Error("Course with that id is not found");
  }
  await courseModel.getCourseById(id);
  return { mesaage: "Course found successfully" };
};

//_____________________________________MODULES_______________________________________________

const getAllModules = async (course_id) => {
  try {
    if (!course_id || isNaN(course_id)) {
      throw new Error(`Invalid course_id: ${course_id}`);
    }

    console.log(`Fetching modules for course_id: ${course_id}`);
    return await moduleModel.getAllModules(parseInt(course_id)); // Ensure it is an integer
  } catch (error) {
    console.error("❌ Error fetching modules:", error);
    throw error;
  }
};

const addModules = async (title, course_id, position) => {
  try {
    // Check only within the same course
    const existingModule = await moduleModel.getModulesByTitle(
      title,
      course_id
    );

    if (existingModule) {
      throw new Error("Module with this title already exists in this course");
    }

    // Create a new module
    const newModule = await moduleModel.createModule(
      title,
      course_id,
      position
    );

    return newModule;
  } catch (error) {
    throw new Error(`Error creating module: ${error.message}`);
  }
};

const getModuleByCourseId = async (course_id) => {
  try {
    if (!course_id) {
      throw new Error("course id is not found..");
    }

    const modules = await moduleModel.getModulesByCourseId(course_id);
    return modules;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const deleteModule = async (course_id, module_id) => {
  try {
    if (!module_id) {
      throw new Error("Module ID is required");
    }

    const result = await moduleModel.deleteModule(course_id, module_id);

    return result; // Return the full result, not just a single object
  } catch (error) {
    throw new Error(error.message);
  }
};

//____________________Lectures___________________________________________________

const getAllLectures = async (course_id, module_id) => {
  return await lectureModel.getAllLectures(course_id, module_id);
};

const addLessons = async (lectures) => {
  try {
    const {
      module_id,
      title,
      content_url,
      content_type,
      duration_minutes,
      isDownloadable,
      position,
    } = lectures;

    console.log("Checking if lesson exists...");
    const existingLesson = await lectureModel.getLessonByTitle(title);

    if (existingLesson) {
      throw new Error("Lesson already exists!");
    }

    const newLesson = await lectureModel.createLessons(
      module_id,
      title,
      content_url,
      content_type,
      duration_minutes,
      isDownloadable,
      position
    );
    return newLesson;
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error; // Preserves original error stack
  }
};

const deleteLesson = async (lesson_id) => {
  try {
    if (!lesson_id) {
      throw new Error("Lesson ID is required");
    }
    const result = await lectureModel.deleteLesson(lesson_id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

//____________________________________NOtes_______________________________

const createAdminNotes = async(notes)=>{
try {
  const{ course_id, module_id, lesson_id, title, content, fileUrl, noteType} =notes
  console.log("parameters recieved in admin service",{ course_id, module_id, lesson_id, title, content, fileUrl, noteType})

  const newNotes = await notesModel.addAdminNote(
    course_id,
    module_id,
    lesson_id,
    title,
    content,
    fileUrl,
    noteType
  )
  console.log("newnotes",newNotes);
  

  return newNotes;

} catch (error) {
  console.log("error in service file",error.mesaage);

}
}


const getNotesAdmin = async(course_id,module_id,lesson_id)=>{
   return await notesModel.getAllNotesAdmin(course_id,module_id,lesson_id)
}




module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAdminUsers,
  addUser,
  addCourse,
  getAllCourse,
  courseStatusUpdate,
  usersStatusUpdate,
  deleteCourse,
  getCourseById,
  getAllModules,
  addModules,
  getModuleByCourseId,
  deleteModule,
  getAllLectures,
  getAllLectures,
  addLessons,
  deleteLesson,
  createAdminNotes,
  getNotesAdmin
};
