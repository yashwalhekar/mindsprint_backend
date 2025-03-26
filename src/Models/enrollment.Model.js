// const db = require("../config/db");


// exports.enrollUser = async (user_id, course_id) => {
//   try {
//     // Check if the user is already enrolled
//     const [existing] = await db.query(
//       `SELECT 1 FROM enrollment WHERE user_id = ? AND course_id = ?`,
//       [user_id, course_id]
//     );

//     if (existing.length > 0) {
//       return { success: false, message: "User already enrolled in this course" };
//     }

//     // Enroll the user with enrollment date and status
//     await db.query(
//       `INSERT INTO enrollment (user_id, course_id, enrollment_date, status) VALUES (?, ?, NOW(), 'Active')`,
//       [user_id, course_id]
//     );

//     return { success: true, message: "Enrollment successful" };
//   } catch (error) {
//     console.error("❌ Error in enrollUser:", error);

//     // Return a descriptive error message
//     return { success: false, message: "Database error occurred. Please try again." };
//   }
// };


