const mysql = require("mysql");
const { Decrypter } = require("./crytography");
require("dotenv").config();

let connection;

const initializeConnection = async () => {
  // Decrypt the password
  const passwordPromise = new Promise((resolve, reject) => {
    Decrypter(process.env._PASSWORD_ADMIN, (err, decrypted) => {
      if (err) {
        reject(err);
      } else {
        resolve(decrypted);
      }
    });
  });

  try {
    const password = await passwordPromise;

    // Create the connection
    connection = mysql.createConnection({
      host: process.env._HOST_ADMIN,
      user: process.env._USER_ADMIN,
      password: password,
      database: process.env._DATABASE_ADMIN,
      timezone: "PST",
    });

    // Connect to MySQL
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database: ", err);
      } else {
        console.log("MySQL database connection established successfully!");
      }
    });

  } catch (error) {
    console.error("Error during database connection setup: ", error);
  }
};

initializeConnection();

exports.getConnection = () => connection;

exports.Select = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);

        return callback(error, null);
      }
      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Update = async (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log("Rows affected:", results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.SelectParameter = (sql, condition, callback) => {
  connection.query(sql, [condition], (error, results, fields) => {
    if (error) {
      return callback(error, null);
    }
    // console.log(results);

    callback(null, results);
  });
};

exports.Insert = (stmt, todos, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        callback(err, null);
      }
      // callback(null, Row inserted: ${results});
      let data = [
        {
          rows: results.affectedRows,
          id: results.insertId,
        },
      ];
      callback(null, data);
      // console.log(Row inserted: ${results.affectedRows});
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.InsertTable = (sql, data, callback) => {
  this.Insert(sql, data, (err, result) => {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  });
};







// const mysql = require("mysql");
// const { Encrypter, Decrypter } = require("./crytography");
// require("dotenv").config();

// let password = "";
// Decrypter(process.env._PASSWORD_ADMIN, (err, encrypted) => {
//   if (err) console.error("Error: ", err);
//   // console.log(encrypted);
//   password = encrypted;
// });

// const connection = mysql.createConnection({
//   host: process.env._HOST_ADMIN,
//   user: process.env._USER_ADMIN,
//   password: password,
//   database: process.env._DATABASE_ADMIN,
//   timezone: "PST",
// });

// exports.CheckConnection = () => {
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connection to MYSQL database: ", err);
//       return;
//     }
//     console.log("MySQL database connection established successfully!");
//   });
// };