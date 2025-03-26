const { getCourse, getCourseById } = require("../Services/courseService");

exports.getCourses = async (req, res) => {
  try {
    const response = await getCourse();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getCourseById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
