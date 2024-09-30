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
  Validator(req, res, "announcementslayout");
});

module.exports = router;


router.get("/load", (req, res) => {
  try {
    let schoolid = req.session.schoolid;  
    let sql = `SELECT * FROM bulletin WHERE b_schoolid = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "b_");

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
  console.log("SAVE");
  try {
    let image = req.body.image;
    let tittle = req.body.tittle;
    let type = req.body.type;
    let targetdate = req.body.targetdate;
    let enddate = req.body.enddate;
    let description = req.body.description;
    let createby = req.session.fullname;
    let createdate = GetCurrentDatetime();
    let status = "Active";
    let schoolid = req.session.schoolid;
    
    

    let sql = InsertStatement("bulletin", "b", [
      "schoolid",
      "image",
      "tittle",
      "type",
      "targetdate",
      "enddate",
      "description",
      "createby",
      "createdate",
      "status",
    ]);

    console.log(sql);
    

    let data = [
      [
        schoolid,
        image,
        tittle,
        type,
        targetdate,
        enddate,
        description,
        createby,
        createdate,
        status,
      ],
    ];

    //console.log(data);
    
    let checkStatement = SelectStatement(
      "select * from bulletin where b_tittle=? and b_type=? and b_targetdate=? and b_status",
      [tittle, type, targetdate, status]
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


router.post("/getannouncement", (req, res) => {
  try {
    let bulletinid = req.body.bulletinid;
    let sql = `SELECT * FROM bulletin WHERE b_bulletinid = '${bulletinid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "b_");

        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse(result));
      }
    });
  } catch (error) {
    res.json(JsonErrorResponse(error));
  }
});


router.put("/edit", (req, res) => {
  try {
    let bulletinid = req.body.bulletinid;
    let image = req.body.image;
    let tittle = req.body.tittle;
    let type = req.body.type;
    let targetdate = req.body.targetdate;
    let enddate = req.body.enddate;
    let description = req.body.description;
    let createby = req.session.fullname;
    let status = req.body.status;

    let data = [];
    let columns = [];
    let arguments = [];

    if (image) {
      data.push(image);
      columns.push("image");
    }

    if (tittle) {
      data.push(tittle);
      columns.push("tittle");
    }

    if (targetdate) {
      data.push(targetdate);
      columns.push("targetdate");
    }

    if (enddate) {
      data.push(enddate);
      columns.push("enddate");
    }


    if (type) {
      data.push(type);
      columns.push("type");
    }

    if (description) {
      data.push(description);
      columns.push("description");
    }

    if (createby) {
      data.push(createby);
      columns.push("createby");
    }


    if (status) {
      data.push(status);
      columns.push("status");
    }

    if (bulletinid) {
      data.push(bulletinid);
      arguments.push("bulletinid");
    }

    let updateStatement = UpdateStatement(
      "bulletin",
      "b",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from bulletin where b_bulletinid = ? and b_tittle = ? and b_type = ? and b_status = ? and b_image = ? and b_description = ? and b_enddate = ? and b_targetdate = ?",
      [bulletinid, tittle, type, status, image, description, enddate, targetdate]
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
