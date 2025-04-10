const { getLectures } = require("../Services/lecture.Service");

exports.getAllLessons = async (req, res) => {
    try {
      const { course_id, module_id } = req.params;
      console.log("Received module_id:", req.body.module_id, req.params.module_id, req.query.module_id);
      const response = await getLectures(course_id, module_id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };