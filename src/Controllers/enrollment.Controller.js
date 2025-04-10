const { enrollUserService, getALLEnrollements } = require("../Services/enrollment.Service");

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

const getAllEnrollesInfo = async(req,res)=>{
  try {
    const response = await getALLEnrollements()

    return res.status(response.success?200:400).json(response)
  } catch (error) {
    console.log("error in controller",error.message)
    return res.status(500).json({success:false,message:error.message})
  }
}

module.exports = { enrollUser,getAllEnrollesInfo };
