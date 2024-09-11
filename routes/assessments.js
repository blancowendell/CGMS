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
  Validator(req, res, "assessmentslayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
        a_assessment_id,
        a_assessment_name,
        a_assessment_type,
        a_created_by,
        DATE_FORMAT(a_created_date, "%d-%m-%Y") as a_created_date
        FROM assessments
        where a_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "a_");

        //console.log(data);
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

router.post("/save", (req, res) => {
  try {
    const { assessmentname, assessmenttype, description } = req.body;
    let schoolid = req.session.schoolid;
    let created_by = req.session.fullname;
    let created_date = GetCurrentDatetime();

    let sql = InsertStatement("assessments", "a", [
      "assessment_name",
      "assessment_description",
      "assessment_type",
      "created_by",
      "created_date",
      "school_id",
    ]);

    let data = [
      [
        assessmentname,
        description,
        assessmenttype,
        created_by,
        created_date,
        schoolid,
      ],
    ];
    let checkStatement = SelectStatement(
      "select * from assessments where a_assessment_name=? and a_assessment_type=?",
      [assessmentname, assessmenttype]
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
    console.log(err);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/getassessments", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let assessment_id = req.body.assessment_id;
    let sql = `SELECT
        a_assessment_name,
        a_assessment_type,
        a_assessment_description
        FROM assessments
        where a_school_id = '${schoolid}'
        and a_assessment_id = '${assessment_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "a_");

        //console.log(data);
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

router.put("/edit", (req, res) => {
  try {
    const { assessment_id, assessmentname, assessmenttype, description } = req.body;
    let created_by = req.session.fullname;
    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (assessmentname) {
      data.push(assessmentname);
      columns.push("assessment_name");
    }

    if (assessmenttype) {
      data.push(assessmenttype);
      columns.push("assessment_type");
    }

    if (description) {
      data.push(description);
      columns.push("assessment_description");
    }

    if (created_by) {
      data.push(created_by);
      columns.push("created_by");
    }

    if (create_date) {
        data.push(create_date);
        columns.push("created_date");
    }

    if (assessment_id) {
      data.push(assessment_id);
      arguments.push("assessment_id");
    }

    let updateStatement = UpdateStatement(
      "assessments",
      "a",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from assessments where a_assessment_name = ? and a_assessment_description = ? and a_assessment_type = ?",
      [assessmentname, description, assessmenttype]
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json(JsonWarningResponse(MessageStatus.EXIST));
        } else {
          Update(updateStatement, data, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

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
