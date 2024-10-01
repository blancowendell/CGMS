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
const { Validator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
require("dotenv").config();
const googleTrends = require("google-trends-api");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("indexlayout", { title: "Express" });
// });
router.get("/", function (req, res, next) {
  Validator(req, res, "indexlayout");
});

module.exports = router;

router.get('/trending_jobs', async (req, res) => {
  try {
    const response = await fetch('https://remoteok.io/api?location=Philippines');
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      const jobTitles = data.slice(0, 10).map(job => job.position);
      res.json(jobTitles);
    } else {
      res.status(404).json({ message: 'No trending jobs available in the Philippines' });
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send('Error fetching data from Remote OK API');
  }
});



router.get("/loadmoststrand", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `
        SELECT 
        asn.as_name AS sa_strand_name,
        COUNT(asn.as_name) AS sa_strand_count 
    FROM 
        student_answers sa
    JOIN 
        master_choices mc ON sa.sa_choice = mc.mc_id
    JOIN 
        personality_type pt ON mc.mc_personality_id = pt.pt_type_id
    LEFT JOIN 
        academic_strands asn ON JSON_CONTAINS(pt.pt_strands_id, CONCAT('"', asn.as_id, '"'))
    WHERE sa_school_id = '${schoolid}'
    GROUP BY 
        asn.as_name 
    ORDER BY 
        sa_strand_count DESC
    LIMIT 0, 5000`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "sa_");
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


router.get("/totalstudents", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT 
    count(*) as ms_total_students
    FROM master_students
    WHERE ms_school_id = ${schoolid}`

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "ms_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error))
    console.log(error);
  }
});

router.get("/totalrespondent", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT COUNT(DISTINCT sa_student_id) AS sa_total_respondent
    FROM student_answers
    WHERE sa_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "sa_");
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


router.get("/newparticipant", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT COUNT(*) AS sa_total_students_not_in_answers
    FROM master_students ms
    WHERE NOT EXISTS (
      SELECT 1 
      FROM student_answers sa
      WHERE sa.sa_student_id = ms.ms_studentid
      AND sa.sa_school_id = ms.ms_school_id
    ) AND ms_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "sa_");
        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error))
    console.log(error);
  }
});