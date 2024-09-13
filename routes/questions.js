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
const { Validator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
require("dotenv").config();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("indexlayout", { title: "Express" });
// });
router.get("/", function (req, res, next) {
  Validator(req, res, "questionslayout");
});

module.exports = router;


router.get("/load", (req, res) => {
  try {
    let sql = `SELECT 
    q_question_id,
    a_assessment_name as q_assessment,
    q_question_text,
    q_question_type
    FROM questions
    INNER JOIN assessments ON questions.q_assessment_id = a_assessment_id`;

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
    res.json(JsonErrorResponse(error));
  }
});


router.post("/save", (req, res) => {
  try {
    const { assessment_id, question_text, ifyes, ifno, ifyesname, ifnoname } = req.body;
    let created_by = req.session.fullname;
    let created_date = GetCurrentDatetime();

    let insertQuestions = InsertStatement("questions", "q", [
      "assessment_id",
      "question_text",
      "question_type",
      "created_by",
      "created_date",
    ]);

    let insertChoices = InsertStatement("master_choices", "mc", [
      "name",
      "personality_id",
      "created_by",
      "created_date",
    ]);

    let dataChoicesifYes = [
      [
        ifyesname,
        ifyes,
        created_by,
        created_date,
      ],
    ];

    let dataChoicesifNo = [
      [
        ifnoname,
        ifno,
        created_by,
        created_date,
      ],
    ];

    let dataQuestions = [
      [
        assessment_id,
        question_text,
        ifyes,
        ifno,
        created_by,
        created_date,
      ],
    ];

    let checkStatement = SelectStatement(
      "select * from questions where q_assessment_id = ? and q_question_text = ? and q_question_type = ?",
      [assessment_id, question_text, ifyes]
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
