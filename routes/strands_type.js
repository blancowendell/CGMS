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
//   res.render("strands_typelayout", { title: "Express" });
// });

router.get("/", function (req, res, next) {
  Validator(req, res, "strands_typelayout");
});

module.exports = router;

router.get("/loadtype", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
    st_id,
    st_name,
    st_status,
    DATE_FORMAT (st_create_date, '%Y-%m-%d') AS st_create_date,
    st_create_by
    FROM strands_type
    WHERE st_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "st_");

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

router.post("/savetype", (req, res) => {
  try {
    const { strandsName, description } = req.body;
    let schoolid = req.session.schoolid;
    let status = "Active";
    let createby = req.session.fullname;
    let createdate = GetCurrentDatetime();

    let sql = InsertStatement("strands_type", "st", [
      "school_id",
      "name",
      "description",
      "status",
      "create_date",
      "create_by",
    ]);

    let data = [
      [schoolid, strandsName, description, status, createdate, createby],
    ];
    let checkStatement = SelectStatement(
      "select * from strands_type where st_name=? and st_description=? and st_status=?",
      [strandsName, description, status]
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

router.post("/viewstrandtype", (req, res) => {
  try {
    let strandtypeid = req.body.strandtypeid;
    let school_id = req.session.schoolid;
    let sql = `SELECT * FROM strands_type WHERE st_id = '${strandtypeid}' AND st_school_id = '${school_id}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      //console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "st_");

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

router.put("/edittype", (req, res) => {
  try {
    const { strandtypeid, name, status, description } = req.body;
    let create_by = req.session.fullname;
    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (name) {
      data.push(name);
      columns.push("name");
    }

    if (description) {
      data.push(description);
      columns.push("description");
    }

    if (status) {
      data.push(status);
      columns.push("status");
    }

    if (create_date) {
      data.push(create_date);
      columns.push("create_date");
    }

    if (create_by) {
      data.push(create_by);
      columns.push("create_by");
    }

    if (strandtypeid) {
      data.push(strandtypeid);
      arguments.push("id");
    }

    let updateStatement = UpdateStatement(
      "strands_type",
      "st",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from strands_type where st_name = ? and st_description = ? and st_status = ?",
      [name, description, status]
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

router.get("/loadstrands", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let sql = `SELECT
    as_id,
    st_name as as_strand,
    as_name,
    as_course_description,
    as_job_description,
    as_create_by,
    DATE_FORMAT(as_create_date, '%Y-%m-%d') AS as_create_date
    FROM academic_strands
    INNER JOIN strands_type ON academic_strands.as_strands_type = st_id
    WHERE as_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      if (result != 0) {
        let data = DataModeling(result, "as_");

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

router.post("/savestrands", (req, res) => {
  try {
    const { strandsType, strandsName, coursedesc, jobdesc } = req.body;
    let schoolid = req.session.schoolid;
    let createby = req.session.fullname;
    let createdate = GetCurrentDatetime();

    let sql = InsertStatement("academic_strands", "as", [
      "school_id",
      "strands_type",
      "name",
      "course_description",
      "job_description",
      "create_by",
      "create_date",
    ]);

    let data = [
      [
        schoolid,
        strandsType,
        strandsName,
        coursedesc,
        jobdesc,
        createby,
        createdate,
      ],
    ];
    let checkStatement = SelectStatement(
      "select * from academic_strands where as_strands_type=? and as_name=?",
      [strandsType, strandsName,]
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

router.post("/viewstrand", (req, res) => {
  try {
    let schoolid = req.session.schoolid;
    let strand_id = req.body.strand_id;
    let sql = `SELECT * FROM academic_strands WHERE as_id = '${strand_id}' AND as_school_id = '${schoolid}'`;

    Select(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json(JsonErrorResponse(err));
      }

      //console.log(result);

      if (result != 0) {
        let data = DataModeling(result, "as_");

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

router.put("/editstrand", (req, res) => {
  try {
    const { strand_id, strandtypeid, name, coursedesc, jobdesc } = req.body;
    let create_by = req.session.fullname;
    let create_date = GetCurrentDatetime();

    let data = [];
    let columns = [];
    let arguments = [];

    if (strandtypeid) {
      data.push(strandtypeid);
      columns.push("strands_type");
    }

    if (name) {
      data.push(name);
      columns.push("name");
    }

    if (coursedesc) {
      data.push(coursedesc);
      columns.push("course_description");
    }

    if (jobdesc) {
      data.push(jobdesc);
      columns.push("job_description");
    }

    if (create_by) {
      data.push(create_by);
      columns.push("create_by");
    }

    if (create_date) {
      data.push(create_date);
      columns.push("create_date");
    }

    if (strand_id) {
      data.push(strand_id);
      arguments.push("id");
    }

    let updateStatement = UpdateStatement(
      "academic_strands",
      "as",
      columns,
      arguments
    );

    console.log(updateStatement);

    let checkStatement = SelectStatement(
      "select * from academic_strands where as_strands_type = ? and as_name = ? and as_course_description = ? and as_job_description = ?",
      [strandtypeid, name, coursedesc, jobdesc]
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
