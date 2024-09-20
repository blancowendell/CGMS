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
  StudentValidator(req, res, "student_careerguidelayout");
});

module.exports = router;


router.get("/loadquestion", function (req, res) {
  try {
    let schoolId = req.session.schoolid;
    let sql = `SELECT
    q_question_id,
    q_question_name, 
    q_question_text,
    (SELECT mc_name FROM master_choices
    WHERE mc_choice_type = 'yes' AND mc_question_id = q_question_id) as q_choices_yes,
    (SELECT mc_name FROM master_choices
    WHERE mc_choice_type = 'no' AND mc_question_id = q_question_id) as q_choices_no ,
    (SELECT mc_id FROM master_choices
    WHERE mc_choice_type = 'yes' AND mc_question_id = q_question_id) as q_id_yes,
    (SELECT mc_id FROM master_choices
    WHERE mc_choice_type = 'no' AND mc_question_id = q_question_id) as q_id_no 
    FROM questions
    WHERE q_school_id = '${schoolId}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "q_");

        //console.log(data);
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


router.post("/submitanswers", function (req, res) {
  console.log('HIT');
  
  try {
    const { questionId, answerText, choiceId } = req.body;

    console.log(req.body);
    
    let schoolId = req.session.schoolid;
    let studentId = req.session.studentid

    let sql = InsertStatement("student_answers", "sa", [
      "student_id",
      "question_id",
      "answer_text",
      "school_id",
      "choice",
    ]);

    let data = [
      [
        studentId,
        questionId,
        answerText,
        schoolId,
        choiceId,
      ]
    ];
    let checkStatement = SelectStatement(
      "select * from student_answers where sa_student_id=? and sa_question_id=?",
      [ studentId, questionId ]
    );

    Check(checkStatement)
    .then((result) => {
      console.log(result);
      if (result != 0) {
        return res.json(JsonWarningResponse(MessageStatus.EXIST));
      } else {
        InsertTable(sql, data, (err, result) => {
          if (err) {
            console.log(err);
            res.json(JsonErrorResponse(err));
          }

          res.json(JsonSuccess());
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json(JsonErrorResponse(error));
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error))
  }
});


router.get("/viewresult", function (req, res) {
  try {
    let school_id = req.session.schoolid;
    let student_id = req.session.studentid;

    let sql  = `
        SELECT 
        pt.pt_type_id AS q_personality_type_id,
        pt.pt_code AS q_personality_code,
        pt.pt_description AS q_personality_description,
        pt.pt_strands_id AS q_strand_ids,
        COUNT(pt.pt_type_id) AS q_personality_count,  -- Add this back for counting personality types
        GROUP_CONCAT(DISTINCT asn.as_name) AS q_strand_names,
        GROUP_CONCAT(DISTINCT asn.as_course_description) AS q_course_descriptions,
        GROUP_CONCAT(DISTINCT asn.as_job_description) AS q_job_descriptions
    FROM 
        student_answers sa
    JOIN 
        master_choices mc ON sa.sa_choice = mc.mc_id
    JOIN 
        personality_type pt ON mc.mc_personality_id = pt.pt_type_id
    LEFT JOIN 
        academic_strands asn ON JSON_CONTAINS(pt.pt_strands_id, CONCAT('"', asn.as_id, '"')) -- Matching the strands in JSON
    WHERE 
        sa.sa_student_id = '${student_id}'
        AND sa.sa_school_id = pt.pt_school_id
        AND asn.as_school_id = '${school_id}'
    GROUP BY 
        pt.pt_type_id, pt.pt_code, pt.pt_description, pt.pt_strands_id
    ORDER BY 
        q_personality_count DESC  -- Now correctly reference the alias
    LIMIT 1`;

    console.log(sql);
    

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "q_");

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



router.get("/checkstudent", function (req, res) {
  try {
    let school_id = req.session.schoolid;
    let student_id = req.session.studentid;

    let sql = `SELECT * FROM student_answers
      WHERE sa_student_id = '${student_id}'
      AND sa_school_id = '${school_id}'`;

    console.log(sql);

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      console.log(result);
      

      // Check if result is an array and has elements
      if (Array.isArray(result) && result.length === 0) {
        res.json({
          msg: "notexist",
        });
      } else {
        res.json({
          msg: "exist",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
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
