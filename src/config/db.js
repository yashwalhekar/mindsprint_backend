const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,                    
    trustServerCertificate: true     
  },
  pool: {
    max: 10,                           
    min: 0,                            
    idleTimeoutMillis: 30000          
  }
};

let pool;

const connectToDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      
      console.log("✅ SQL Server connected successfully!");
      return pool;   //here i return the pool it allows you to call pool.request
    }
    return pool;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    throw error;
  }
};

// ✅ Function to get the connection and create a request
const getDBConnection = () => {
  if (!pool) throw new Error("❌ Database not connected. Call connectToDB() first.");
  return pool.request();
};

module.exports = {
  connectToDB,
  getDBConnection,
  sql
};
