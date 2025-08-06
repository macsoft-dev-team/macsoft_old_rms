const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.addListener("error", (err) => {
  console.log(err);
});

module.exports = connection;