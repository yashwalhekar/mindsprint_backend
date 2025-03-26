const { getModules } = require("../Services/module.Service");


exports.getModules = async (req, res) => {
    try {
      const { course_id } = req.params;
      const response = await getModules(course_id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };