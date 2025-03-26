const Enrollment = require("../Models/enrollment.Model");

const enrollUserService = async (user_id, course_id) => {
  return await Enrollment.enrollUser(user_id, course_id);
};

module.exports = { enrollUserService };