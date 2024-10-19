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
const { DataModeling } = require("../routes/model/cgmsdb");
const { Encrypter, Decrypter } = require("./repository/crytography");
require("dotenv").config();
router.get("/", function (req, res, next) {
  Validator(req, res, "master_studentlayout");
});

module.exports = router;


router.get("/load", (req, res) => {
    try {
        let sql = `SELECT 
        ms_studentid,
        CONCAT(ms_lastname,' ',ms_firstname) AS ms_fullname,
        ms_email,
        s_school_name as ms_school_name,
        ms_username
        FROM master_students
        INNER JOIN school ON master_students.ms_school_id = s_school_id`;

        Select(sql, (err, result) => {
            if (err) {
                console.error(err);
                res.json(JsonErrorResponse(err));
            }

            if (result != 0) {
                let data = DataModeling(result, "ms_");

                console.log(data);
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


router.post("/getstudent", (req, res) => {
    try {
        let studentid = req.body.studentid;
        let sql = `SELECT 
        ms_studentid,
        CONCAT(ms_lastname,' ',ms_firstname,' ',ms_lastname) AS ms_fullname,
        ms_email,
        s_school_name AS ms_school_name,
        ms_username,
        ms_password
        FROM master_students
        INNER JOIN school ON master_students.ms_school_id = s_school_id
        WHERE ms_studentid = '${studentid}'`;

        Select(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.json(JsonErrorResponse(err));
            }

            if (result.length > 0) {
                let data = DataModeling(result, "ms_");               
                Decrypter(data[0].password, (decryputError, decryptedPassword) => {
                    if (decryputError) {
                        return res.json(JsonErrorResponse(decryputError));
                    }
                    data[0].password = decryptedPassword;
                    res.json(JsonDataResponse(data));
                });
            } else {
                res.json(JsonDataResponse([]));
            }
        });
    } catch (error) {
        console.log(error);
        res.json(JsonErrorResponse(error));
    }
});
  