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
//const { Validator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("../routes/model/cgmsdb");
require("dotenv").config();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("videocliplayout", { title: "Express" });
// });


router.get("/", function (req, res, next) {
  Validator(req, res, "videocliplayout");
});

module.exports = router;

router.get("/load", function (req, res, next) {
  try {
    let sql = `SELECT
        vc_id,
        vc_name,
        as_name as vc_strands,
        vc_description,
        vc_create_date,
        vc_create_by
        FROM video_clip
        INNER JOIN academic_strands ON video_clip.vc_strandsid = as_id`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "vc_");

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
      const {
        clipname,
        strandsname,
        clipdescription,
        clipupload,
        youtubelink,
      } = req.body;
      let create_date = GetCurrentDatetime();
      let create_by = GetValue(ACT);
  
      let sql = InsertStatement("video_clip", "vc", [
        "name",
        "strandsid",
        "file",
        "description",
        "youtubelink",
        "create_date",
        "create_by",
      ]);
  
      let data = [
        [
          clipname,
          strandsname,
          clipupload,
          clipdescription,
          youtubelink,
        ],
      ];
      let checkStatement = SelectStatement(
        "select * from master_institutions where mi_name=? and mi_address=?",
        [institutionsname, institutionsaddress]
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