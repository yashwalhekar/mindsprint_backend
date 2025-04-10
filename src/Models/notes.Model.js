const db = require("../config/db")
const sql = require('mssql'); // Ensure mssql is imported properly

// const createTable = async () => {
//   try {
//     const pool = await db.connectToDB();

//     const createTableQuery = `
//     IF NOT EXISTS (
//         SELECT * FROM INFORMATION_SCHEMA.TABLES 
//         WHERE TABLE_NAME = 'notes'
//     )
//     BEGIN
//         CREATE TABLE notes (
//             notes_id INT IDENTITY(1,1) PRIMARY KEY,
//             user_id INT NOT NULL,
//             course_id INT NOT NULL,
//             module_id INT NOT NULL,
//             lesson_id INT NOT NULL,
//             title VARCHAR(255),
//             content TEXT,
//             file_url VARCHAR(255),
//             note_type VARCHAR(20) CHECK (note_type IN ('text', 'pdf', 'image')),
//             is_public BIT DEFAULT 0,
//             created_at DATETIME DEFAULT GETDATE(),
//             updated_at DATETIME DEFAULT GETDATE()
//         );
//     END;
//     `;

//     const addConstraintsQuery = `
//     ALTER TABLE notes
//     ADD CONSTRAINT FK_Notes_User FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

//     ALTER TABLE notes
//     ADD CONSTRAINT FK_Notes_Course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE;

//     ALTER TABLE notes
//     ADD CONSTRAINT FK_Notes_Module FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE NO ACTION;

//     ALTER TABLE notes
//     ADD CONSTRAINT FK_Notes_Lecture FOREIGN KEY (lesson_id) REFERENCES lectures(lesson_id) ON DELETE NO ACTION;
//     `;

//     await pool.request().query(createTableQuery);
//     await pool.request().query(addConstraintsQuery);

//     console.log("✅ Notes table and constraints created successfully.");

//   } catch (error) {
//     console.error("❌ Error creating notes table:", error);
//   } finally {
//     pool.close();
//   }
// };

// createTable().catch((err) => console.error("Error creating table:", err));


const addAdminNote = async (course_id, module_id, lesson_id, title, content, fileUrl, noteType) => {
  try {
    console.log("Parameters received in model:", { course_id, module_id, lesson_id, title, content, fileUrl, noteType });

    const pool = await db.connectToDB();
    console.log(`noteType passed: ${noteType}`);

    const insertQuery = `
      INSERT INTO notes (course_id, module_id, lecture_id, title, content, file_url, note_type)
      OUTPUT INSERTED.*
      VALUES (@course_id, @module_id, @lecture_id, @title, @content, @fileUrl, @noteType);
    `;

    const result = await pool.request()
      .input('course_id', sql.Int, course_id)
      .input('module_id', sql.Int, module_id)
      .input('lecture_id', sql.Int, lesson_id)
      .input('title', sql.VarChar(255), title)
      .input('content', sql.Text, content || '') // Content can be empty
      .input('fileUrl', sql.NVarChar(sql.MAX), fileUrl || '') // File URL for PDFs or images
      .input('noteType', sql.VarChar(20), noteType || '') // 'text', 'pdf', 'image'
      .query(insertQuery);

    console.log("✅ Admin note added successfully:", result.recordset);

    return { success: true, data: result.recordset[0] }; // Return the inserted row
  } catch (error) {
    console.error("❌ Error adding admin note:", error.message);
    return { success: false, error: error.message };
  }
};


const getAllNotesAdmin =async(course_id,module_id,lesson_id)=>{
try {
  console.log("Received parameters:", {
    course_id, 
    module_id, 
    lesson_id
  });

  // Ensure the IDs are numbers
  if (
    isNaN(course_id) || 
    isNaN(module_id) || 
    isNaN(lesson_id)
  ) {
    throw new Error("Invalid input: IDs must be numbers.");
  }
  
  const pool = await db.connectToDB();

  const sqlQuery =  `SELECT * FROM notes 
  Where course_id = @course_id
  AND module_id = @module_id
  AND lecture_id = @lecture_id`;

  const result = await pool.request()
  .input('course_id',sql.Int,course_id)
  .input('module_id',sql.Int,module_id)
  .input('lecture_id',sql.Int,lesson_id)
  .query(sqlQuery)

  console.log("Data fetched Successfully",result.recordset)

  return{success:true,data:result.recordset}

} catch (error) {
  console.log("Error in model page", error.message)
}
}


module.exports = {addAdminNote,getAllNotesAdmin}