const { enrollUserService } = require("../Services/enrollment.Service");

const enrollUser = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res.status(400).json({ success: false, message: "Missing user_id or course_id" });
    }

    const result = await enrollUserService(user_id, course_id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in enrollUser:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { enrollUser };
