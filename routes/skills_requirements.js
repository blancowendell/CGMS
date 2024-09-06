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
        let sql = `SELECT
        sr_id,
        sr_name,
        as_name as sr_strands,
        sr_status
        FROM skills_requirements
        INNER JOIN academic_strands ON skills_requirements.sr_strandid = as_id`;

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
      let status = 'Active';
  
      let sql = InsertStatement("skills_requirements", "sr", [
        "name",
        "strandid",
        "status",
      ]);
  
      let data = [
        [
          reqname,
          strandsName,
          status,
        ],
      ];
      let checkStatement = SelectStatement(
        "select * from skills_requirements where sr_name=? and sr_strandid=? and sr_status=?",
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
        let requirementid = req.body.requirementid;
        let sql = `SELECT * FROM skills_requirements WHERE sr_id = '${requirementid}'`;

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
      const { requirementid, strandid, name, status } = req.body;
  
      let data = [];
      let columns = [];
      let arguments = [];

      if (strandid) {
        data.push(strandid);
        columns.push("strandid");
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
        "select * from skills_requirements where sr_name = ? and sr_strandid = ? and sr_status = ?",
        [name, strandid, status]
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
  