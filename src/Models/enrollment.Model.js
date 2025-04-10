const sql = require("mssql");
const db = require("../config/db");

exports.enrollUser = async (user_id, course_id) => {
  try {

    const pool = await db.connectToDB()
    // Check if the user is already enrolled
    const checkQuery = `
      SELECT 1 
      FROM enrollment 
      WHERE user_id = @user_id AND course_id = @course_id
    `;

    const checkResult = await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("course_id", sql.Int, course_id)
      .query(checkQuery);

    if (checkResult.recordset.length > 0) {
      return { success: false, message: "User already enrolled in this course" };
    }

    // Enroll the user with current date and status
    const enrollQuery = `
      INSERT INTO enrollment (user_id, course_id, enrollment_date, status)
      VALUES (@user_id, @course_id, GETDATE(), 'Active')
    `;

    await pool.request()
      .input("user_id", sql.Int, user_id)
      .input("course_id", sql.Int, course_id)
      .query(enrollQuery);

    return { success: true, message: "Enrollment successful" };
  } catch (error) {
    console.error("❌ Error in enrollUser:", error);
    return { success: false, message: "Database error occurred. Please try again." };
  }
};

exports.getAllEnrollees = async () => {
  try {
    const pool = await db.connectToDB();

    const query = `
      SELECT 
        e.enrollment_id,
        e.user_id,
        u.first_name AS user_name,         
        e.course_id,
        c.title AS course_title,     
        e.enrollment_date,
        e.status
      FROM enrollment e
      INNER JOIN users u ON e.user_id = u.user_id
      INNER JOIN courses c ON e.course_id = c.course_id
      ORDER BY e.enrollment_date DESC
    `;

    const result = await pool.request().query(query);

    return {
      success: true,
      data: result.recordset
    };
  } catch (error) {
    console.error("❌ Error in getAllEnrollees:", error);
    return {
      success: false,
      message: "Failed to fetch enrollees"
    };
  }
};
