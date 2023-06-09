require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const  {connectToDB} = require("./config/connection");
const session=require('express-session');
const flash = require('connect-flash');
const exphbs  = require('express-handlebars');
const hbs = require('hbs');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const Swal = require('sweetalert2');

// const fileUpload = require('express-fileupload');
const multer = require('multer');
const handlebars = require('handlebars');
const helpers = require('handlebars-helpers')();


const app = express();

// Custom helper function for comparison
handlebars.registerHelper('isEqual', function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

handlebars.registerHelper('isNotEqual', function (value1, value2, options) {
  if (value1 != value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

handlebars.registerHelper('range', function(start, end, options) {
  let result = '';
  for (let i = start; i <= end; i++) {
    result += options.fn(i);
  }
  return new handlebars.SafeString(result);
});

handlebars.registerHelper('rangeWithQuery', function(start, end, query, options) {
  let result = '';
  for (let i = start; i <= end; i++) {
    result += options.fn({ query, page: i });
  }
  return new handlebars.SafeString(result);
});

handlebars.registerHelper('isLessThan', function(value, threshold, options) {
  console.log("islessthan fn invocked" , value, threshold);
  if (value < threshold && value > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


handlebars.registerHelper('isGreaterThan', function(value, threshold, options) {
  console.log("isGreaterthan fn invocked" , value, threshold);
  if (value > threshold) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('MMM Do YY');
});

handlebars.registerHelper('incrementIndex', function (index) {
  // Add 1 to the index
  return index + 1;
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.engine('hbs', exphbs.create({
  extname: 'hbs',
  defaultLayout: 'adminLayout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    isPathActive: handlebars.helpers.isPathActive
  },
  handlebars: handlebars
}).engine);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret:'key',resave: false,saveUninitialized: true,cookie:{maxAge:600000}}));
app.use(flash());
// app.use(fileUpload());
// app.use(client());


startDb()


app.use("/admin", adminRouter);
app.use("/", userRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('404',{layout: "commonLayout"});
  
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

async function startDb(){
  await connectToDB()
}


module.exports = app;
