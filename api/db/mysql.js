const mysql = require("mysql2/promise");

const connection = async () => {
  try {
    const conn = await mysql.createConnection(
      process.env.DATABASE_URL || {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      }
    );

    return conn;
  } catch (err) {
    console.log("Failed to create MySQL connection:", err);
    throw err;
  }
};

module.exports = connection;
