const { getDBConnection,sql } = require("../config/db")
// ✅ Create user
exports.createUser = async (user) => {
  try {
    const request = await getDBConnection();   // ✅ Await connection

    const query = `
      INSERT INTO users (first_name, last_name, dob, email, password, phone, address, city, state, country, school, role)
      VALUES (@first_name, @last_name, @dob, @email, @password, @phone, @address, @city, @state, @country, @school, @role)
    `;

    // ✅ Bind parameters (without user_id)
    request.input("first_name", sql.NVarChar, user.first_name);
    request.input("last_name", sql.NVarChar, user.last_name);
    request.input("dob", sql.Date, user.dob || null);
    request.input("email", sql.NVarChar, user.email);
    request.input("password", sql.NVarChar, user.password);
    request.input("phone", sql.NVarChar, user.phone || null);
    request.input("address", sql.NVarChar, user.address || null);
    request.input("city", sql.NVarChar, user.city || null);
    request.input("state", sql.NVarChar, user.state || null);
    request.input("country", sql.NVarChar, user.country || null);
    request.input("school", sql.NVarChar, user.school || null);
    request.input("role", sql.NVarChar, user.role || "user");

    const result = await request.query(query);
    console.log("✅ User created successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    throw error;
  }
};



// ✅ Get all users
exports.getAllUsers = async () => {
  try {
    const sql = `SELECT * FROM users`;
    const request = getDBConnection();
    const result = await request.query(sql);
    return result.recordset;
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    throw error;
  }
};

// ✅ Update user role
exports.updateUserRole = async (id, role) => {
  try {
    const sql = `UPDATE users SET role = @role WHERE id = @id`;
    const request = getDBConnection();
    request.input("id", sql.Int, id);
    request.input("role", sql.NVarChar, role);
    await request.query(sql);
  } catch (error) {
    console.error("❌ Error updating user role:", error.message);
    throw error;
  }
};

// ✅ Delete user
exports.deleteUser = async (id) => {
  try {
    const sql = `DELETE FROM users WHERE id = @id`;
    const request = getDBConnection();
    request.input("id", sql.Int, id);
    await request.query(sql);
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    throw error;
  }
};

// ✅ Get user by email
exports.getUserByEmail = async (email) => {
  try {
    const request = await getDBConnection();  // Await the connection
    request.input("email", sql.NVarChar(100), email);  // Correct parameter usage
    
    const result = await request.query(`SELECT * FROM users WHERE email = @email`);
    return result.recordset[0];
  } catch (error) {
    console.error("❌ Error fetching user by email:", error.message);
    throw error;
  }
};


// ✅ Get all admin users
exports.getAllAdminUsers = async () => {
  try {
    const sql = `SELECT id, first_name, last_name, dob, email, role FROM users WHERE role = 'admin'`;
    const request = getDBConnection();
    const result = await request.query(sql);
    return result.recordset;
  } catch (error) {
    console.error("❌ Error fetching admin users:", error.message);
    throw error;
  }
};

// ✅ Update user status
exports.updateStatus = async (id, status) => {
  try {
    const sql = `UPDATE users SET status = @status WHERE id = @id`;
    const request = getDBConnection();
    request.input("id", sql.Int, id);
    request.input("status", sql.NVarChar, status);
    const result = await request.query(sql);
    return result;
  } catch (error) {
    console.error("❌ Error updating user status:", error.message);
    throw error;
  }
};
