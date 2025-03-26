const extractCourseId = (req, res, next) => {
    if (req.params.course_id) {
      req.courseId = req.params.course_id; // Attach course_id to request object
    }
    next();
  };
  
  module.exports = { extractCourseId };