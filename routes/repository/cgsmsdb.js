const mysql = require("mysql");
const { Encrypter, Decrypter } = require("./crytography");
require("dotenv").config();

let password = "";
Decrypter(process.env._PASSWORD_ADMIN, (err, encrypted) => {
  if (err) console.error("Error: ", err);
  // console.log(encrypted);
  password = encrypted;
});

Decrypter("97b1658adae301177bba5f775972b020b58229f1876b445c56ed6d711ef4e376", (err, encrypted) => {
  if (err) console.error("Error: ", err);
  console.log(encrypted);
});

// Encrypter('101520122321', (err, encrypted) => {
//   if (err) console.error("Error: ", err);
//   console.log(encrypted);
// });

Encrypter("5lsolutions101520", (err, encrypted) => {
  if (err) console.error("Error: ", err);
  console.log(encrypted);
});

const connection = mysql.createConnection({
  host: process.env._HOST_ADMIN,
  user: process.env._USER_ADMIN,
  password: password,
  database: process.env._DATABASE_ADMIN,
  timezone: "PST",
});

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL database: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};


exports.mysqlQueryPromise = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

