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
    q_question_name,
    a_assessment_name as q_assessment_name, 
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
    const { assessment_id, question_text, ifyes, ifno, ifyesname, ifnoname, question_name } = req.body;
    let created_by = req.session.fullname;
    let created_date = GetCurrentDatetime();
    let school_id = req.session.schoolid;
    let ifnotype = 'no';
    let ifyestype = 'yes';
    let insertQuestions = InsertStatement("questions", "q", [
      "question_name",
      "school_id",
      "assessment_id",
      "question_text",
      "question_type",
    ]);
    let insertChoices = InsertStatement("master_choices", "mc", [
      "name",
      "choice_type",
      "personality_id",
      "question_id", 
      "create_by",
      "create_date",
    ]);

    let dataQuestions = [
      [question_name ,school_id, assessment_id, question_text, "Multiple Choice",],
    ];

    let checkStatement = SelectStatement(
      "select * from questions where q_assessment_id = ? and q_question_name = ?",
      [assessment_id, question_name]
    );

    Check(checkStatement)
      .then((result) => {
        if (result.length !== 0) {
          return res.json(JsonWarningResponse(MessageStatus.EXIST));
        } else {
          InsertTable(insertQuestions, dataQuestions, (err, result) => {
            if (err) {
              console.log(err);
              return res.json(JsonErrorResponse(err));
            }

            let insertedQuestionId = result[0].id;
            let dataChoicesifYes = [
              [ifyesname, ifyestype, ifyes, insertedQuestionId, created_by, created_date],
            ];

            let dataChoicesifNo = [
              [ifnoname, ifnotype, ifno, insertedQuestionId, created_by, created_date],
            ];
            InsertTable(insertChoices, dataChoicesifYes, (err, result) => {
              if (err) {
                console.log(err);
                return res.json(JsonErrorResponse(err));
              }
              InsertTable(insertChoices, dataChoicesifNo, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json(JsonErrorResponse(err));
                }
                return res.json(JsonSuccess());
              });
            });
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

router.post("/getchoicesidyes", (req, res) => {
  try {
    let question_id = req.body.question_id;
    let sql = `SELECT mc_id 
    FROM master_choices 
    WHERE mc_question_id = '${question_id}'
    AND mc_choice_type = 'yes'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "mc_");

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

router.post("/getchoicesidno", (req, res) => {
  try {
    let question_id = req.body.question_id;
    let sql = `SELECT mc_id 
    FROM master_choices 
    WHERE mc_question_id = '${question_id}'
    AND mc_choice_type = 'no'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "mc_");

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


router.post("/getquestion", (req, res) => {
  try {
    let question_id = req.body.question_id;
    let sql = `  SELECT 
    q_question_name,
    q_assessment_id,
    q_question_text,
    mc_name as q_choice_name,
    mc_personality_id as q_personality_id,
    mc_choice_type as q_choice_type
    FROM questions
    INNER JOIN master_choices ON questions.q_question_id = mc_question_id
    WHERE q_question_id = '${question_id}'`;

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
    res.json(JsonErrorResponse(error));
  }
});

router.put("/edit", async (req, res) => {
  try {
    const {
      question_id,
      assessment_id,
      question_name,
      question_text,
      ifyes,
      ifno,
      ifyesname,
      ifnoname,
      globalYesChoiceId,
      globalNoChoiceId
    } = req.body;

    let questionData = [];
    let questionColumns = [];
    let questionArguments = [];
    
    if (assessment_id) {
      questionData.push(assessment_id);
      questionColumns.push("assessment_id");
    }

    if (question_name) {
      questionData.push(question_name);
      questionColumns.push("question_name");
    }

    if (question_text) {
      questionData.push(question_text);
      questionColumns.push("question_text");
    }

    if (question_id) {
      questionData.push(question_id);
      questionArguments.push("question_id");
    }

    let updateQuestionStatement = UpdateStatement(
      "questions",
      "q",
      questionColumns,
      questionArguments
    );

    let checkStatement = SelectStatement(
      "SELECT * FROM master_choices WHERE mc_personality_id = ? AND mc_question_id = ? ",
      [ifyes, question_id]
    );

    let duplicate = await Check(checkStatement);

    if (duplicate.length > 0) {
      return res.json(JsonWarningResponse("exist"));
    }

    await Update(updateQuestionStatement, questionData, (err, result) => {
      if (err) {
        console.error("Error updating questions: ", err);
        return res.json(JsonErrorResponse(err));
      }

      console.log("Questions updated:", result);

        let choiceDataYes = [];
        let choiceColumnsYes = [];
        let choiceArgumentsYes = [];

        if (ifyesname) {
          choiceDataYes.push(ifyesname);
          choiceColumnsYes.push("name");
        }

        if (ifyes) {
          choiceDataYes.push(ifyes);
          choiceColumnsYes.push("personality_id");
        }

        if (globalYesChoiceId) {
          choiceDataYes.push(globalYesChoiceId);
          choiceArgumentsYes.push("id");
        }

        let updateChoiceStatementYes = UpdateStatement(
          "master_choices",
          "mc",
          choiceColumnsYes,
          choiceArgumentsYes
        );

        console.log("Generated SQL Query for 'If Yes':", updateChoiceStatementYes);
        console.log("Data for 'If Yes':", choiceDataYes);

         Update(updateChoiceStatementYes, choiceDataYes, (err, result) => {
          if (err) {
            console.error("Error updating 'If Yes' choices: ", err);
            return res.json(JsonErrorResponse(err));
          }
          console.log("'If Yes' Choices updated:", result);
        });

        let choiceDataNo = [];
        let choiceColumnsNo = [];
        let choiceArgumentsNo = [];

        if (ifnoname) {
          choiceDataNo.push(ifnoname);
          choiceColumnsNo.push("name");
        }

        if (ifno) {
          choiceDataNo.push(ifno);
          choiceColumnsNo.push("personality_id");
        }

        if (globalNoChoiceId) {
          choiceDataNo.push(globalNoChoiceId);
          choiceArgumentsNo.push("id");
        }

        let updateChoiceStatementNo = UpdateStatement(
          "master_choices",
          "mc",
          choiceColumnsNo,
          choiceArgumentsNo
        );

        console.log("Generated SQL Query for 'If No':", updateChoiceStatementNo);
        console.log("Data for 'If No':", choiceDataNo);

       Update(updateChoiceStatementNo, choiceDataNo, (err, result) => {
          if (err) {
            console.error("Error updating 'If No' choices: ", err);
            return res.json(JsonErrorResponse(err));
          }
          console.log("'If No' Choices updated:", result);
        });
      res.json(JsonSuccess("success"));
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
