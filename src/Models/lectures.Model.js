const db = require("../config/db");

// ✅ Create Table in MSSQL
const createTable = async () => {
  try {
    const pool = await db.connectToDB();
    const sql = `
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'lectures'
      )
      CREATE TABLE lectures (
        lesson_id INT IDENTITY(1,1) PRIMARY KEY,
        module_id INT,
        title NVARCHAR(MAX),
        content_url NVARCHAR(MAX),
        content_type NVARCHAR(50) CHECK (content_type IN ('Document', 'Quiz', 'Live Session')),
        duration_minutes FLOAT,
        isDownloadable BIT,
        position INT,
        created_at DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Module FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE
      );
    `;

    await pool.request().query(sql);
    console.log("✅ Lecture table checked/created successfully");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
};

createTable().catch((err) => console.error("Error creating table:", err));


// ✅ Get All Lectures by course_id and module_id
exports.getAllLectures = async (course_id, module_id) => {
  try {
    const pool = await db.connectToDB();
    const sqlQuery = `
      SELECT * 
      FROM lectures 
      WHERE module_id = @module_id 
    `;
    
    const result = await pool.request()
      .input("module_id", db.sql.Int, module_id)
      .query(sqlQuery);

    return result.recordset;
  } catch (error) {
    console.error("❌ Error getting lectures:", error);
    throw error;
  }
};


// ✅ Create a New Lesson
exports.createLessons = async (module_id, title, content_url, content_type, duration_minutes, isDownloadable, position) => {
  try {
    const pool = await db.connectToDB();
    
    // Insert lesson query
    const insertSql = `
      INSERT INTO lectures (module_id, title, content_url, content_type, duration_minutes, isDownloadable, position)
      VALUES (@module_id, @title, @content_url, @content_type, @duration_minutes, @isDownloadable, @position);
      SELECT SCOPE_IDENTITY() AS lesson_id; -- Get inserted ID
    `;

    const insertResult = await pool.request()
      .input("module_id", db.sql.Int, module_id)
      .input("title", db.sql.NVarChar, title)
      .input("content_url", db.sql.NVarChar, content_url)
      .input("content_type", db.sql.NVarChar, content_type)
      .input("duration_minutes", db.sql.Float, duration_minutes)
      .input("isDownloadable", db.sql.Bit, isDownloadable)
      .input("position", db.sql.Int, position)
      .query(insertSql);

    const lesson_id = insertResult.recordset[0].lesson_id;

    // Retrieve the newly inserted lesson
    const selectSql = `SELECT * FROM lectures WHERE lesson_id = @lesson_id`;
    const lessonResult = await pool.request()
      .input("lesson_id", db.sql.Int, lesson_id)
      .query(selectSql);

    return lessonResult.recordset[0];
  } catch (error) {
    console.error("❌ Error creating lesson:", error);
    throw new Error("Failed to create lesson");
  }
};


// ✅ Get Lesson by Title
exports.getLessonByTitle = async (title) => {
  try {
    const pool = await db.connectToDB();
    const sqlQuery = `SELECT * FROM lectures WHERE title = @title`;

    const result = await pool.request()
      .input("title", db.sql.NVarChar, title)
      .query(sqlQuery);

    return result.recordset[0];
  } catch (error) {
    console.error("❌ Error getting lesson by title:", error);
    return { error: error.message };
  }
};


// ✅ Delete a Lesson by ID
exports.deleteLesson = async (lesson_id) => {
  try {
    const pool = await db.connectToDB();
    const sqlQuery = `DELETE FROM lectures WHERE lesson_id = @lesson_id`;

    const result = await pool.request()
      .input("lesson_id", db.sql.Int, lesson_id)
      .query(sqlQuery);

    return result.rowsAffected[0];  // Return number of deleted rows
  } catch (error) {
    console.error("❌ Error deleting lesson:", error);
    return { error: error.message };
  }
};
