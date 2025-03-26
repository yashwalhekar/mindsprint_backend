const courseModel = require("../Models/Course.Model");

const getCourse = async () => {
  return await courseModel.getAllCourses();
};

const getCourseById = async (id) => {
  try {
    if (!id) {
      throw new Error("Id is Required");
    }
    return await courseModel.getCourseById(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCourse,
  getCourseById
};
