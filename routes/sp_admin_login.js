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
const { SuperAdminLogin } = require("./repository/helper");
require("dotenv").config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("sp_admin_loginlayout", { title: "Express" });
});

module.exports = router;


router.post("/login", (req, res) => {
    try {
      const { username, password} = req.body;
  
      console.log(req.body);
      
      
  
      Encrypter(password, (err, encrypted) => {
        if (err) console.error("Error: ", err);
  
        let sql = `SELECT
        sau_userid AS userid,
        sau_fullname AS fullname,
        sau_status AS status,
        sau_image AS image
        FROM super_admin_user
        WHERE sau_username = '${username}'
        AND sau_password = '${encrypted}'`;
  
        mysql.mysqlQueryPromise(sql)
          .then((result) => {
            if (result.length !== 0) {
              const user = result[0];
  
              console.log(result);
              
  
              if (
                user.status === "Active"
              ) {
                let data = SuperAdminLogin(result);
                  data.forEach((user) => {
                    req.session.userid = user.userid;
                    req.session.fullname = user.fullname;
                    req.session.status = user.status;
                    req.session.image = user.image;
                  });
                  console.log('fullname',req.session.fullname);
                  return res.json({
                    msg: "success",
                    data: data,
                  });
              } else {
                return res.json({
                  msg: "inactive",
                });
              }
            } else {
              return res.json({
                msg: "incorrect",
              });
            }
          })
          .catch((error) => {
            return res.json({
              msg: "error",
              data: error,
            });
          });
      });
    } catch (error) {
      res.json({
        msg: error,
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