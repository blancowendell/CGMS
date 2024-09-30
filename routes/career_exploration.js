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
  Validator(req, res, "career_explorationlayout");
});

module.exports = router;


router.get("/load", function (req, res) {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
    ce_explorationid,
    ce_tittle,
    as_name as ce_strand,
    ce_description
    FROM career_exploration
    INNER JOIN academic_strands ON career_exploration.ce_strand_id = as_id
    WHERE ce_schoolid = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "ce_");

        //console.log(data);
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



router.post("/save", (req, res) => {
  try {
    const {
      clipname,
      strandsname,
      clipdescription,
      clipupload,
      youtubelink,
    } = req.body;
    let schoolid = req.session.schoolid;

    let sql = InsertStatement("career_exploration", "ce", [
      "schoolid",
      "strand_id",
      "tittle",
      "description",
      "video",
      "youtube_link",
    ]);

    let data = [
      [
        schoolid,
        strandsname,
        clipname,
        clipdescription,
        clipupload,
        youtubelink,
      ],
    ];

    console.log(data,'data');
    
    let checkStatement = SelectStatement(
      "select * from career_exploration where ce_strand_id=? and ce_tittle=? and ce_youtube_link=?",
      [strandsname, clipname, youtubelink]
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
            console.log(result,'result');
            
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


router.post("/viewvideo", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let clipvideoid = req.body.clipvideoid;
    let sql = `SELECT 
    ce_tittle,
    ce_strand_id,
    ce_video,
    ce_description,
    ce_youtube_link
    FROM career_exploration
    WHERE ce_explorationid = '${clipvideoid}'
    AND ce_schoolid = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result, "result");
      

      if (result != 0) {
        let data = DataModeling(result, "ce_");

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
    const { clipvideoid, clipName, strandName, 
      clipDescription, youtubeLink, clipUpload } = req.body;

    let data = [];
    let columns = [];
    let arguments = [];

    if (clipUpload) {
      data.push(clipUpload);
      columns.push("video");
    }

    if (clipName) {
      data.push(clipName);
      columns.push("tittle");
    }

    if (strandName) {
      data.push(strandName);
      columns.push("strand_id");
    }

    if (clipDescription) {
      data.push(clipDescription);
      columns.push("description");
    }

    if (youtubeLink) {
      data.push(youtubeLink);
      columns.push("youtube_link");
    }

    if (clipvideoid) {
      data.push(clipvideoid);
      arguments.push("explorationid");
    }

    let updateStatement = UpdateStatement(
      "career_exploration",
      "ce",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from career_exploration where ce_tittle = ? and ce_strand_id = ? and ce_youtube_link = ?",
      [clipName, strandName, youtubeLink]
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
  