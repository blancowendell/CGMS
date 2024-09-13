const mysql = require("../routes/repository/cgsmsdb");
const moment = require("moment");
var express = require("express");
const {
  MessageStatus,
  JsonErrorResponse,
  JsonSuccess,
  JsonWarningResponse,
  JsonDataResponse,
} = require("./repository/response");
const {
  SelectStatement,
  InsertStatement,
  GetCurrentDatetime,
} = require("./repository/customhelper");
const { InsertTable, Select } = require("./repository/dbconnect");
//const { Validator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
const { Encrypter } = require("./repository/crytography");
const { AdminLogin } = require("./repository/helper");
const e = require("express");
require("dotenv").config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("student_registrationlayout", { title: "Express" });
});

module.exports = router;

router.post("/register", (req, res) => {
  try {
    let {
      username,
      password,
      schoolid,
      firstname,
      middlename,
      lastname,
      email,
    } = req.body;
    let accesstypeid = 2;

    // Encrypt the password before storing it
    Encrypter(password, (err, encrypted) => {
      if (err) {
        console.error("Error encrypting password:", err);
        return res.json(JsonErrorResponse(err));
      } else {
        // SQL insert statement for the new student
        let sql = InsertStatement("master_students", "ms", [
          "username",
          "password",
          "school_id",
          "firstname",
          "middlename",
          "lastname",
          "email",
          "access_id",
        ]);

        // Data to be inserted
        let data = [
          [
            username,
            encrypted,
            schoolid,
            firstname,
            middlename,
            lastname,
            email,
            accesstypeid,
          ],
        ];

        // SQL to check if the user already exists
        let checkStatement = SelectStatement(
          "select * from master_students where ms_email = ?",
          [email]
        );

        // Check if the user already exists in the database
        Check(checkStatement)
          .then((result) => {
            if (result.length !== 0) {
              return res.json(JsonWarningResponse(MessageStatus.EXIST));
            } else {
              // Insert the new student record
              InsertTable(sql, data, (err, result) => {
                if (err) {
                  console.log("Error inserting data:", err);
                  return res.json(JsonErrorResponse(err));
                }

                // Registration successful
                return res.json({
                  msg: "success",
                  data: result,
                });
              });
            }
          })
          .catch((error) => {
            console.log("Error checking user:", error);
            return res.json(JsonErrorResponse(error));
          });
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return res.json(JsonErrorResponse(error));
  }
});

//#region FUNCTION
function Check(sql) {
  return new Promise((resolve, reject) => {
    Select(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}
//#endregion
