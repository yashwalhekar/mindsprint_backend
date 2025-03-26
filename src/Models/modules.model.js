const { connectToDB,sql } = require("../config/db");

// ✅ Create modules table if it doesn't exist
const createTable = async () => {
  try {
    const pool = await connectToDB();
    const request = pool.request(); 

    const sql = `
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'modules')
    BEGIN
        CREATE TABLE modules (
            module_id INT IDENTITY(1,1) PRIMARY KEY,
            course_id INT NOT NULL,
            title NVARCHAR(MAX),
            position INT,
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
        );
    END;
    `;

    await request.query(sql); 
   
    console.log("✅ modules table checked/created successfully");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
};
createTable().catch((err) => console.error("Error creating table:", err));

// ✅ Create module
exports.createModule = async (title, course_id, position) => {
  try {
    const pool = await connectToDB();
    
    // Rename the SQL query variable to avoid conflict
    const sqlQuery = `
      INSERT INTO modules (title, course_id, position) 
      VALUES (@title, @course_id, @position);
      SELECT SCOPE_IDENTITY() AS insertedId;`;

    const request = pool.request();
    
    // Use the correct mssql sql object
    request.input("title", sql.NVarChar, title);
    request.input("course_id", sql.Int, course_id);
    request.input("position", sql.Int, position);

    const result = await request.query(sqlQuery);

    console.log("Insert Result:", result);
    console.log("Inserted ID:", result.recordset[0].insertedId);

    return {
      id: result.recordset[0].insertedId,
      title,
      course_id,
      position,
    };
  } catch (error) {
    console.error("❌ Error inserting module:", error);
    throw error;
  }
};

// ✅ Get all modules
exports.getAllModules = async (course_id) => {
  try {
    const pool = await connectToDB();
    const sqlQuery = `
      SELECT * FROM modules
      WHERE course_id = @course_id`;
    const request = pool.request();
    request.input("course_id", sql.Int, course_id);

    const result = await request.query(sqlQuery);
    return result.recordset;
  } catch (error) {
    console.error("❌ Error fetching modules:", error);
    throw error;
  }
};

// ✅ Get module by title
exports.getModulesByTitle = async (title, course_id) => {
  try {
    const pool = await connectToDB();
    
    // Use a different variable name for the SQL query
    const sqlQuery = `
      SELECT * FROM modules
      WHERE title = @title AND course_id = @course_id`;

    const request = pool.request();
    
    // Ensure you're using the sql module from mssql
    request.input("title", sql.NVarChar, title);
    request.input("course_id", sql.Int, course_id);

    const result = await request.query(sqlQuery);
    return result.recordset[0];
  } catch (error) {
    console.error("❌ Error fetching module by title:", error);
    throw error;
  }
};

// ✅ Get modules by course ID
exports.getModulesByCourseId = async (course_id) => {
  try {
    const pool = await connectToDB();
    
    const sqlQuery = `
      SELECT * FROM modules
      WHERE course_id = @course_id`;

    const request = pool.request();
    request.input("course_id", sql.Int, course_id);

    const result = await request.query(sqlQuery);
    return result.recordset;
  } catch (error) {
    console.error("❌ Error fetching modules by course ID:", error);
    throw error;
  }
};

// ✅ Delete module
exports.deleteModule = async (course_id, module_id) => {
  try {
    const pool = await connectToDB();
    
    const sqlQuery = `
      DELETE FROM modules
      WHERE course_id = @course_id AND module_id = @module_id`;

    const request = pool.request();
    request.input("course_id", sql.Int, course_id);
    request.input("module_id", sql.Int, module_id);

    const result = await request.query(sqlQuery);
    console.log(`✅ Deleted Module ID: ${module_id}`);

    return result.rowsAffected[0];
  } catch (error) {
    console.error("❌ Error deleting module:", error);
    throw error;
  }
};
