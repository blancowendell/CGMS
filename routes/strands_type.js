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
require("dotenv").config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("strands_typelayout", { title: "Express" });
});

module.exports = router;


router.get("/loadtype", (req, res) => {
  try {
    let sql = `SELECT
    st_id,
    st_name,
    st_status,
    DATE_FORMAT (st_create_date, '%Y-%m-%d') AS st_create_date,
    st_create_by
    FROM strands_type`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "st_");

        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.error(error);
    res.json(JsonErrorResponse(error));
  }
});



router.get("/loadstrands", (req, res) => {
  try {
    let sql = `SELECT
    as_id,
    st_name as as_strand,
    as_name,
    as_course_description,
    as_job_description,
    as_create_by,
    DATE_FORMAT(as_create_date, '%Y-%m-%d') AS as_create_date
    FROM academic_strands
    INNER JOIN strands_type ON academic_strands.as_strands_type = st_id`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "as_");

        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.error(error);
    res.json(JsonErrorResponse(error));
  }
});
