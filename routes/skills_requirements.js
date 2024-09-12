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

router.get("/", function (req, res, next) {
  Validator(req, res, "skills_requirementslayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
        sr_id,
        sr_name,
        as_name as sr_strands,
        sr_status
        FROM skills_requirements
        INNER JOIN academic_strands ON skills_requirements.sr_strand_id = as_id
        AND sr_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      //console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "sr_");

        //console.log(data);
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

router.post("/save", (req, res) => {
  try {
    const { strandsName, reqname } = req.body;
    let schoolid = req.session.schoolid;
    let status = "Active";

    let sql = InsertStatement("skills_requirements", "sr", [
      "school_id",
      "name",
      "strand_id",
      "status",
    ]);

    let data = [[schoolid, reqname, strandsName, status]];
    let checkStatement = SelectStatement(
      "select * from skills_requirements where sr_name=? and sr_strand_id=? and sr_status=?",
      [reqname, strandsName, status]
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

router.post("/viewjobrequirements", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let requirementid = req.body.requirementid;
    let sql = `SELECT * FROM skills_requirements WHERE sr_id = '${requirementid}' AND sr_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      //console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "sr_");

        //console.log(data);
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

router.put("/edit", (req, res) => {
  try {
    const { requirementid, strand_id, name, status } = req.body;

    let data = [];
    let columns = [];
    let arguments = [];

    if (strand_id) {
      data.push(strand_id);
      columns.push("strand_id");
    }

    if (name) {
      data.push(name);
      columns.push("name");
    }

    if (status) {
      data.push(status);
      columns.push("status");
    }

    if (requirementid) {
      data.push(requirementid);
      arguments.push("id");
    }

    let updateStatement = UpdateStatement(
      "skills_requirements",
      "sr",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from skills_requirements where sr_name = ? and sr_strand_id = ? and sr_status = ?",
      [name, strand_id, status]
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
