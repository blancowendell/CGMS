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
  UpdateStatement,
} = require("./repository/customhelper");
const { InsertTable, Select, Update } = require("./repository/dbconnect");
const { StudentValidator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
require("dotenv").config();

router.get("/", function (req, res, next) {
  StudentValidator(req, res, "student_indexlayout");
});

module.exports = router;


router.get("/dashboard", function (req, res) {
  try {
    let schoolId = req.session.schoolid;
    let sql = `SELECT
    st_name,
    as_id as st_strand,
    as_name as st_academicstrand,
    as_course_description as st_description
    FROM strands_type
    INNER JOIN academic_strands ON strands_type.st_id = as_strands_type
    WHERE st_school_id = '${schoolId}'`;
    
    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "st_");

        console.log(data);
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});

router.post("/viewstrand", function (req, res) {
  try {
    let strand_id = req.body.strand_id;
    let sql = `SELECT
    as_name,
    jd_name as as_job_desc,
    jr_name as as_job_req,
    sr_name as as_job_skill,
    vc_description as as_video_desc,
    vc_file as as_video_file,
    vc_youtubelink as as_video_link
    FROM academic_strands
    INNER JOIN job_descriptions ON academic_strands.as_id = jd_strand_id
    INNER JOIN job_requirements ON academic_strands.as_id = jr_strand_id
    INNER JOIN skills_requirements ON academic_strands.as_id = sr_strand_id
    INNER JOIN video_clip ON academic_strands.as_id = vc_strandsid
    WHERE as_id = '${strand_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "as_");

        console.log(data);
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});


router.get("/notification", (req, res) => {
  try {
    let studentid = req.session.studentid;

    let sql = `SELECT 
    b_bulletinid as n_bulletinid,
    b_createby as n_createby,
    b_image as n_image,
    b_tittle as n_tittle
    FROM notification
    INNER JOIN bulletin ON notification.n_bulletinid = b_bulletinid
    WHERE n_student_id = '${studentid}'
    AND n_isread = 'NO'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "n_");

        console.log(data,'result');
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});

router.get("/countnotification", (req, res) => {
  try {
    let studentid = req.session.studentid;
    let sql = `SELECT
    count(n_notificationid) as n_countnotif
    FROM notification
    WHERE n_student_id = '${studentid}'
    AND n_isrecieved = 'NO'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "n_");

        console.log(data);
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});


router.post("/viewnotification", (req, res) => {
  try {
    let notificationid = req.body.notificationid;
    let sql = `
    SELECT 
    b_bulletinid,
    b_createby,
    b_image,
    b_tittle,
    b_description,
    b_targetdate,
    b_enddate
    FROM bulletin
    WHERE b_bulletinid = '${notificationid}'`;
    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "b_");

        console.log(data);
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});