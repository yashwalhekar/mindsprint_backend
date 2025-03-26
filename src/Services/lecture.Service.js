
const lectureModel = require("../Models/lectures.Model")

const getLectures = async (course_id,module_id) => {
  return await lectureModel.getAllLectures(course_id,module_id);
};


module.exports = {getLectures}