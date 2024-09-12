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
  Validator(req, res, "videocliplayout");
});

module.exports = router;

router.get("/load", function (req, res, next) {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
        vc_id,
        vc_name,
        as_name as vc_strands,
        vc_description,
        DATE_FORMAT(vc_create_date, '%d-%m-%Y') as vc_create_date,
        vc_create_by
        FROM video_clip
        INNER JOIN academic_strands ON video_clip.vc_strandsid = as_id
        AND VC_school_id = '${schoolid}'`;

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
      let schoolid = req.session.schoolid;
      let create_date = GetCurrentDatetime();
      let create_by = req.session.fullname;
  
      let sql = InsertStatement("video_clip", "vc", [
        "school_id",
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
          schoolid,
          clipname,
          strandsname,
          clipupload,
          clipdescription,
          youtubelink,
          create_date,
          create_by,
        ],
      ];
      let checkStatement = SelectStatement(
        "select * from video_clip where vc_strandsid=? and vc_name=? and vc_youtubelink=?",
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

router.post("/viewvideo", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let clipvideoid = req.body.clipvideoid;
    let sql = `SELECT 
    vc_name,
    vc_strandsid,
    vc_file,
    vc_description,
    vc_youtubelink
    FROM video_clip
    WHERE vc_id = '${clipvideoid}'
    AND vc_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result, "result");
      

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


router.put("/edit", (req, res) => {
  try {
    const { clipvideoid, clipName, strandName, 
      clipDescription, youtubeLink, clipUpload } = req.body;
    let create_by = req.session.fullname;
    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (clipUpload) {
      data.push(clipUpload);
      columns.push("file");
    }

    if (clipName) {
      data.push(clipName);
      columns.push("name");
    }

    if (strandName) {
      data.push(strandName);
      columns.push("strandsid");
    }

    if (clipDescription) {
      data.push(clipDescription);
      columns.push("description");
    }

    if (youtubeLink) {
      data.push(youtubeLink);
      columns.push("youtubelink");
    }

    if (create_by) {
      data.push(create_by);
      columns.push("create_by");
    }

    if (create_date) {
      data.push(create_date);
      columns.push("create_date");
    }

    if (clipvideoid) {
      data.push(clipvideoid);
      arguments.push("id");
    }

    let updateStatement = UpdateStatement(
      "video_clip",
      "vc",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from video_clip where vc_name = ? and vc_strandsid = ? and vc_youtubelink = ?",
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
