var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { SetMongo } = require("./routes/controller/mongoose");
const cors = require("cors");



//var
var indexRouter = require("./routes/index");
var strands_typeRouter = require("./routes/strands_type");
var careerRouter = require("./routes/career");
var videoclipRouter = require("./routes/videoclip");
var loginRouter = require("./routes/login");
var admin_userRouter = require("./routes/admin_user");
var acessRouter = require("./routes/access");
var job_requirementsRouter = require("./routes/job_requirements");
var skills_requirementsRouter = require("./routes/skills_requirements");
var sp_admin_indexlayoutRouter = require("./routes/sp_admin_index");
var sp_admin_schoolRouter = require("./routes/sp_admin_school");
var sp_admin_loginRouter = require("./routes/sp_admin_login");
var assessmentsRouter = require("./routes/assessments");
var personality_typeRouter = require("./routes/personality_type");
var questionsRouter = require("./routes/questions");
var student_loginRouter = require("./routes/student_login");
var student_resgisterRouter = require("./routes/student_registration");
var student_indexRouter = require("./routes/student_index");
var student_careerguideRouter = require("./routes/student_careerguide");
var student_explorationRouter = require("./routes/student_exploration");
var master_studentRouter = require("./routes/master_student");  
var announcementsRouter = require("./routes/announcements");
var career_explorationRouter = require("./routes/career_exploration");
var student_helpcenterRouter = require("./routes/student_helpcenter");
var student_aboutusRouter = require("./routes/student_aboutus");
var forgotpasswordRouter = require("./routes/forgotpassword");
var resetpasswordRouter = require("./routes/resetpassword");
var forgotpassword_adminRouter = require("./routes/forgotpassword_admin");
var resetpassword_adminRouter = require("./routes/resetpassword_admin");

var app = express();

SetMongo(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "assets")));

// app.use(cors(corsOptions));


//app.use
app.use("/", indexRouter);
app.use("/strands_type", strands_typeRouter);
app.use("/career", careerRouter);
app.use("/videoclip", videoclipRouter);
app.use("/login", loginRouter);
app.use("/admin_user", admin_userRouter);
app.use("/access", acessRouter);
app.use("/job_requirements", job_requirementsRouter);
app.use("/skills_requirements", skills_requirementsRouter);
app.use("/sp_admin_index", sp_admin_indexlayoutRouter);
app.use("/sp_admin_school", sp_admin_schoolRouter);
app.use("/sp_admin_login", sp_admin_loginRouter);
app.use("/assessments", assessmentsRouter);
app.use("/personality_type", personality_typeRouter);
app.use("/questions", questionsRouter);
app.use("/student_login", student_loginRouter);
app.use("/student_registration", student_resgisterRouter);
app.use("/student_index", student_indexRouter);
app.use("/student_careerguide", student_careerguideRouter);
app.use("/student_exploration", student_explorationRouter);
app.use("/master_student", master_studentRouter);
app.use("/announcements", announcementsRouter);
app.use("/career_exploration", career_explorationRouter);
app.use("/student_helpcenter", student_helpcenterRouter);
app.use("/student_aboutus", student_aboutusRouter);
app.use("/forgotpassword", forgotpasswordRouter);
app.use("/resetpassword", resetpasswordRouter);
app.use("/forgotpassword_admin", forgotpassword_adminRouter);
app.use("/resetpassword_admin", resetpassword_adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
  
  module.exports = app;
  