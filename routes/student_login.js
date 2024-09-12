const mysql = require("../routes/repository/cgsmsdb");
const moment = require('moment');
var express = require("express");
const { MessageStatus, JsonErrorResponse, JsonSuccess, JsonWarningResponse, JsonDataResponse } = require("./repository/response");
const { SelectStatement, InsertStatement, GetCurrentDatetime } = require("./repository/customhelper");
const { InsertTable, Select } = require("./repository/dbconnect");
//const { Validator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
const { Encrypter } = require("./repository/crytography");
const { StudentLogin } = require("./repository/helper");
require("dotenv").config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("student_loginlayout", { title: "Express" });
});

module.exports = router;

router.post("/login", (req, res) => {
  try {
    const { username, password, schoolid } = req.body;

    console.log(req.body);

    // Encrypt the password before querying the database
    Encrypter(password, (err, encrypted) => {
      if (err) {
        console.error("Error during encryption: ", err);
        return res.json({ msg: "error", data: err });
      }

      let sql = `SELECT
                  ms_studentid AS studentid,
                  CONCAT(ms_lastname,' ',ms_firstname) AS fullname,
                  ma_accessname AS accesstype,
                  ms_school_id AS schoolid
                FROM master_students
                INNER JOIN master_access ON master_students.ms_access_id = ma_accessid
                WHERE ms_username = '${username}'
                AND ms_password = '${encrypted}'
                AND ms_school_id = '${schoolid}'`;

      mysql.mysqlQueryPromise(sql)
        .then((result) => {
          if (result.length !== 0) {
            // Get the first result
            let data = StudentLogin(result);
            data.forEach((user) => {
              req.session.studentid = user.studentid;
              req.session.fullname = user.fullname;
              req.session.accesstype = user.accesstype;
              req.session.schoolid = user.schoolid;
            });

            console.log('schoolid:', req.session.schoolid);

            // Respond with success message and user data
            return res.json({
              msg: "success",
              data: data,
            });
          } else {
            // Respond with incorrect credentials message
            return res.json({
              msg: "incorrect",
            });
          }
        })
        .catch((error) => {
          // Respond with an error if the query fails
          console.error("Database error: ", error);
          return res.json({
            msg: "error",
            data: error,
          });
        });
    });
  } catch (error) {
    // Catch and respond to any other errors
    console.error("Error: ", error);
    return res.json({
      msg: "error",
      data: error,
    });
  }
});



router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.json({
        msg: err,
      });
    res.json({
      msg: "success",
    });
  });
});

