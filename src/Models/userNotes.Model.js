const db = require("../config/db");
const sql = require("mssql"); // Ensure mssql is imported properly

const createUserNotes = async (
    user_id,
    course_id,
    module_id,
    lesson_id,
    title,
    content
  ) => {
    try {
      const pool = await db.connectToDB();
      const sqlQuery = `
        INSERT INTO userNotes (user_id, course_id, module_id, lesson_id, title, content)
        OUTPUT INSERTED.*
        VALUES (@user_id, @course_id, @module_id, @lesson_id, @title, @content)
      `;
  
      const result = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('course_id', sql.Int, course_id)
        .input('module_id', sql.Int, module_id)
        .input('lesson_id', sql.Int, lesson_id)
        .input('title', sql.VarChar(255), title)
        .input('content', sql.NVarChar(sql.MAX), content)
        .query(sqlQuery);
  
      console.log("✅ User note added successfully.");
      return { success: true, data: result.recordset }; // Now, `recordset` contains the inserted row
    } catch (error) {
      console.log("❌ Error in model hello:", error.message);
      return { success: false, error: error.message };
    }
  };

  const getALLUserNotes = async (user_id, course_id, module_id, lesson_id) => {
    try {
      console.log("Received parameters:", { user_id, course_id, module_id, lesson_id });
  
      if (isNaN(user_id) || isNaN(course_id) || isNaN(module_id) || isNaN(lesson_id)) {
        throw new Error("Invalid input: IDs must be numbers.");
      }
  
      const pool = await db.connectToDB();
  
      const sqlQuery = `SELECT * FROM userNotes 
                        WHERE user_id = @user_id 
                        AND course_id = @course_id
                        AND module_id = @module_id
                        AND lesson_id = @lesson_id`;
  
      const result = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('course_id', sql.Int, course_id)
        .input('module_id', sql.Int, module_id)
        .input('lesson_id', sql.Int, lesson_id)
        .query(sqlQuery);
  
      console.log("SQL Query Result:", result); // Log full SQL response
      console.log("Data fetched Successfully:", result.recordset); // Log fetched records
  
      return { success: true, data: result.recordset };
    } catch (error) {
      console.log("Error in model page:", error.message);
      return { success: false, error: error.message }; // Ensure error handling
    }
  };
  
  


module.exports = {createUserNotes,getALLUserNotes}