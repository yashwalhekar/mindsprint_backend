const { getLectures } = require("../Services/lecture.Service");

exports.getAllLessons = async (req, res) => {
    try {
      const { course_id, module_id } = req.params;
      const response = await getLectures(course_id, module_id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };