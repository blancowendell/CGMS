const mysql = require("./repository/cgsmsdb");
const moment = require('moment');
var express = require("express");
const { MessageStatus, JsonErrorResponse, JsonSuccess, JsonWarningResponse, JsonDataResponse } = require("./repository/response");
const { SelectStatement, InsertStatement, GetCurrentDatetime } = require("./repository/customhelper");
const { InsertTable, Select } = require("./repository/dbconnect");
const { SuperAdminValidator } = require("./controller/middleware");
var router = express.Router();
const currentYear = moment().format("YY");
const currentMonth = moment().format("MM");
// const nodemailer = require('nodemailer');
const { DataModeling } = require("./model/cgmsdb");
require("dotenv").config();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("indexlayout", { title: "Express" });
// });
router.get("/", function (req, res, next) {
    SuperAdminValidator(req, res, "sp_admin_schoollayout");
});


module.exports = router;


router.get("/load", (req, res) => {
    try {
        let sql = `SELECT * FROM school`;

        Select(sql, (err, result) => {
            if (err) {
                console.error(err);
                res.json(JsonErrorResponse(err));
            }

            if (result != 0) {
                let data = DataModeling(result, "s_");

                console.log(data);
                res.json(JsonDataResponse(data));
            } else {
                res.json(JsonDataResponse(result));
            }
        });
    } catch (error) {
        res.json(JsonErrorResponse(error));
    }
});