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
  Validator(req, res, "personality_typelayout");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let schoolid = req.session.schoolid;

    // Define the SQL query to retrieve data with strand names
    let sql = `
      WITH extracted_ids AS (
    SELECT 
        pt.pt_code,
        pt.pt_description,
        pt.pt_create_date,
        pt.pt_create_by,
        pt.pt_type_id,
        JSON_UNQUOTE(JSON_EXTRACT(pt.pt_strands_id, CONCAT('$[', idx, ']'))) AS as_id
    FROM 
        personality_type pt
    JOIN 
        (SELECT 0 AS idx UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) AS numbers
    ON 
        JSON_LENGTH(pt.pt_strands_id) > numbers.idx
    WHERE 
        pt.pt_school_id = '${schoolid}'
    )

    SELECT 
        pt.pt_type_id,
        pt.pt_code,
        DATE_FORMAT(pt.pt_create_date, "%d-%m-%Y") as pt_create_date,
        pt.pt_create_by,
        GROUP_CONCAT(as_str.as_name) AS pt_strand_names
    FROM 
        extracted_ids pt
    LEFT JOIN 
        academic_strands as_str 
        ON as_str.as_id = pt.as_id
    GROUP BY 
        pt.pt_type_id, 
        pt.pt_code, 
        pt.pt_create_date,
        pt.pt_create_by;
    `;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(err));
      }

      console.log(result);

      if (result.length > 0) {
        let data = DataModeling(result, "pt_");

        res.json(JsonDataResponse(data));
      } else {
        res.json(JsonDataResponse([]));
      }
    });
  } catch (error) {
    console.log(error);
    res.json(JsonErrorResponse(error));
  }
});

router.post("/save", (req, res) => {
  try {
    let personalitycode = req.body.personalitycode;
    let personalitydesc = req.body.personalitydesc;
    let strandsid = req.body.strandsid; // This should be a JSON string
    let create_date = GetCurrentDatetime();
    let create_by = req.session.fullname;
    let schoolid = req.session.schoolid;

    console.log(personalitycode);
    console.log(personalitydesc);
    console.log(strandsid);

    // Parse the JSON string to an array
    let parsedStrandsid;
    try {
      parsedStrandsid = JSON.parse(strandsid);
    } catch (err) {
      console.log("Error parsing strandsid:", err);
      return res.json(JsonErrorResponse("Invalid JSON format for strandsid"));
    }

    // Ensure that parsedStrandsid is an array
    if (!Array.isArray(parsedStrandsid)) {
      return res.json(JsonErrorResponse("Strandsid is not an array"));
    }

    console.log(parsedStrandsid);

    let sql = InsertStatement("personality_type", "pt", [
      "school_id",
      "code",
      "description",
      "strands_id",
      "create_date",
      "create_by",
    ]);

    let data = [
      [
        schoolid,
        personalitycode,
        personalitydesc,
        JSON.stringify(parsedStrandsid), // Ensure this is a valid JSON string
        create_date,
        create_by,
      ],
    ];

    let checkStatement = SelectStatement(
      "SELECT * FROM personality_type WHERE pt_code=? AND pt_strands_id=?",
      [personalitycode, JSON.stringify(parsedStrandsid)] // Ensure this is a valid JSON string
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json(JsonWarningResponse(MessageStatus.EXIST));
        } else {
          InsertTable(sql, data, (err, result) => {
            if (err) {
              console.log(err);
              res.json(JsonErrorResponse(err));
            } else {
              res.json(JsonSuccess());
            }
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
