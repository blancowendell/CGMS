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
    let strandsid = req.body.strandsid;
    let create_date = GetCurrentDatetime();
    let create_by = req.session.fullname;
    let schoolid = req.session.schoolid;

    console.log(personalitycode);
    console.log(personalitydesc);
    console.log(strandsid);

    let parsedStrandsid;
    try {
      parsedStrandsid = JSON.parse(strandsid);
    } catch (err) {
      console.log("Error parsing strandsid:", err);
      return res.json(JsonErrorResponse("Invalid JSON format for strandsid"));
    }

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
      "SELECT * FROM personality_type WHERE pt_code=?",
      [personalitycode]
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

router.post("/getpersonalitytype", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let type_id = req.body.type_id; 
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
            AND pt.pt_type_id = '${type_id}'
      )

      SELECT 
          pt.pt_type_id,
          pt.pt_code,
          DATE_FORMAT(pt.pt_create_date, "%d-%m-%Y") as pt_create_date,
          pt.pt_create_by,
          pt.pt_description,
          GROUP_CONCAT(as_str.as_name) AS pt_strand_names,
          GROUP_CONCAT(pt.as_id) AS pt_strands_id -- Add this line to return the strand IDs
      FROM 
          extracted_ids pt
      LEFT JOIN 
          academic_strands as_str 
          ON as_str.as_id = pt.as_id
      GROUP BY 
          pt.pt_type_id, 
          pt.pt_code, 
          pt.pt_create_date,
          pt.pt_description,
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


router.put("/edit", (req, res) => {
  try {
    const { type_id, personalitycode, personalitydesc, strandsid } = req.body;
    let create_by = req.session.fullname;
    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (personalitycode) {
      data.push(personalitycode);
      columns.push("code");
    }

    if (personalitydesc) {
      data.push(personalitydesc);
      columns.push("description");
    }

    if (strandsid) {
      columns.push("strands_id");
      data.push(strandsid); // Remove the JSON.stringify() here since it's already a string
    }

    if (create_date) {
      data.push(create_date);
      columns.push("create_date");
    }

    if (create_by) {
      data.push(create_by);
      columns.push("create_by");
    }

    if (type_id) {
      data.push(type_id);
      arguments.push("type_id");
    }

    let updateStatement = UpdateStatement(
      "personality_type",
      "pt",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from personality_type where pt_code = ? and pt_description = ? and pt_strands_id = ?",
      [personalitycode, personalitydesc, JSON.stringify(strandsid)]
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
