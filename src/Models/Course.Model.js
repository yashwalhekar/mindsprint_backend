const { getDBConnection, connectToDB, sql } = require("../config/db");

const createTable = async () => {
  console.log("✅ Starting table creation...");
  try {
    await connectToDB(); // Ensure connection first

    const query = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'courses')
      BEGIN
          CREATE TABLE courses (
              course_id INT IDENTITY(1,1) PRIMARY KEY,
              title NVARCHAR(255) NOT NULL,
              description NVARCHAR(MAX) NOT NULL,
              category NVARCHAR(100) NOT NULL,
              subcategory NVARCHAR(100),
              tags NVARCHAR(MAX),
              level NVARCHAR(20) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
              language NVARCHAR(50) NOT NULL,
              duration_hours DECIMAL(5, 2) NOT NULL,
              image_url NVARCHAR(MAX),
              promo_video_url NVARCHAR(MAX),
              video_url NVARCHAR(MAX),
              price DECIMAL(10, 2) DEFAULT 0.00,
              rating DECIMAL(3, 2) DEFAULT 0.0,
              instructor_id INT NOT NULL,
              status NVARCHAR(20) DEFAULT 'Unpublish' NOT NULL CHECK (status IN ('Published', 'Unpublish')),
              prerequisites NVARCHAR(MAX),
              certificate_template_id INT,
              creator NVARCHAR(255) NOT NULL,
              created_at DATETIME DEFAULT GETDATE(),
              updated_at DATETIME DEFAULT GETDATE()
          );
      END`;

    const request = await getDBConnection();  // Use await to get the connection
    await request.query(query);

    console.log("✅ Courses table checked/created successfully");
  } catch (error) {
    console.error("❌ Error creating table:", error);
    throw error;
  }
};

const createCourse = async (courseData) => {
  await connectToDB();

  try {
    const query = `
      INSERT INTO courses 
      (title, description, category, subcategory, tags, level, language, duration_hours, image_url, 
       promo_video_url, video_url, price, rating, instructor_id, prerequisites, creator)
      VALUES (@title, @description, @category, @subcategory, @tags, @level, @language, 
              @duration_hours, @image_url, @promo_video_url, @video_url, @price, 
              @rating, @instructor_id, @prerequisites, @creator);
      SELECT SCOPE_IDENTITY() AS course_id;
    `;

    const request = await getDBConnection();  // Await the connection
    request
      .input("title", sql.NVarChar(255), courseData.title)
      .input("description", sql.NVarChar(sql.MAX), courseData.description)
      .input("category", sql.NVarChar(100), courseData.category)
      .input("subcategory", sql.NVarChar(100), courseData.subcategory || null)
      .input("tags", sql.NVarChar(sql.MAX), courseData.tags || null)
      .input("level", sql.NVarChar(20), courseData.level)
      .input("language", sql.NVarChar(50), courseData.language)
      .input("duration_hours", sql.Decimal(5, 2), courseData.duration_hours)
      .input("image_url", sql.NVarChar(sql.MAX), courseData.image_url || null)
      .input("promo_video_url", sql.NVarChar(sql.MAX), courseData.promo_video_url || null)
      .input("video_url", sql.NVarChar(sql.MAX), courseData.video_url || null)
      .input("price", sql.Decimal(10, 2), courseData.price || 0.0)
      .input("rating", sql.Decimal(3, 2), courseData.rating || 0.0)
      .input("instructor_id", sql.Int, courseData.instructor_id)
      .input("prerequisites", sql.NVarChar(sql.MAX), courseData.prerequisites || null)
      .input("creator", sql.NVarChar(255), courseData.creator);

    const result = await request.query(query);
    console.log("✅ Course created successfully with ID:", result.recordset[0].course_id);
    return result.recordset[0];
  } catch (error) {
    console.error("❌ Error creating course:", error);
    throw error;
  }
};

const getCourseByTitle = async (title) => {
  await connectToDB();

  try {
    const query = `SELECT * FROM courses WHERE title = @title`;
    const request = await getDBConnection();
    request.input("title", sql.NVarChar(255), title);

    const result = await request.query(query);
    return result.recordset[0] || null;
  } catch (error) {
    console.error("❌ Error fetching course by title:", error);
    throw error;
  }
};

const getCourseById = async (id) => {
  await connectToDB();

  try {
    const query = `SELECT * FROM courses WHERE course_id = @id`;
    const request = await getDBConnection();
    request.input("id", sql.Int, id);

    const result = await request.query(query);
    return result.recordset[0] || null;
  } catch (error) {
    console.error("❌ Error fetching course by ID:", error);
    throw error;
  }
};

const getAllCourses = async () => {
  await connectToDB();

  try {
    const query = `SELECT * FROM courses`;
    const request = await getDBConnection();

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("❌ Error fetching all courses:", error);
    throw error;
  }
};

const deleteCourseById = async (id) => {
  await connectToDB();

  try {
    const query = `DELETE FROM courses WHERE course_id = @id`;
    const request = await getDBConnection();
    request.input("id", sql.Int, id);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("❌ Error deleting course by ID:", error);
    throw error;
  }
};

const updateStatus = async (id, status) => {
  await connectToDB();

  try {
    const query = `
      UPDATE courses 
      SET status = @status, updated_at = GETDATE() 
      WHERE course_id = @id
    `;
    const request = await getDBConnection();
    request
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar(20), status);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("❌ Error updating course status:", error);
    throw error;
  }
};

module.exports = {
  createTable,
  createCourse,
  getCourseByTitle,
  getCourseById,
  getAllCourses,
  deleteCourseById,
  updateStatus
};
