const { addUserNotes, getNotesUser } = require("../Services/notes.Service");

exports.addUserNotes = async (req, res) => {
  try {
    const { course_id, module_id, lesson_id } = req.params;
    const { user_id, title, content } = req.body;

    const response = await addUserNotes({
      user_id,
      course_id: parseInt(course_id),
      module_id: parseInt(module_id),
      lesson_id: parseInt(lesson_id),
      title,
      content,
    });

    console.log("Notes added successfully", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getALLUserNotes = async (req, res) => {
  try {
    const { course_id ,module_id, lesson_id } = req.params;
    const { user_id} = req.query; // user_id is inside req.body
    

    console.log("Received from request:", { user_id, course_id, module_id, lesson_id });

    if (typeof user_id === "object" && user_id !== null) {
      ({ user_id } = user_id);
    }

    const parsedUserId = parseInt(user_id);
    const parsedCourseId = parseInt(course_id);
    const parsedModuleId = parseInt(module_id);
    const parsedLessonId = parseInt(lesson_id);

    if (
      isNaN(parsedUserId) ||
      isNaN(parsedCourseId) ||
      isNaN(parsedModuleId) ||
      isNaN(parsedLessonId)
    ) {
      throw new Error("Invalid input: All IDs must be numbers.");
    }

    // Call the function with correctly formatted parameters
    const response = await getNotesUser(parsedUserId, parsedCourseId, parsedModuleId, parsedLessonId);

    console.log("Controller Response:", JSON.stringify(response, null, 2)); // Log full response

    return res.status(200).json(response); // Ensure correct JSON response
  } catch (error) {
    console.error("Error in controller:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

exports.getALLAdminNotes 


