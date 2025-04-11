var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var appointmentsRouter = require("./routes/appointments");
var authRouter = require("./routes/auth");
var rolesRouter = require("./routes/roles");
var categoriesRouter = require("./routes/categories");
var productsRouter = require("./routes/products");
var menuRouter = require("./routes/menu");
var reviewRouter = require("./routes/review");
var invoiceRouter = require("./routes/invoices");
var tagsRouter = require("./routes/tags");

var app = express();

mongoose.connect("mongodb://localhost:27017/test");
mongoose.connection.on("connected", () => {
  console.log("connected");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/appointments", appointmentsRouter);
app.use("/auth", authRouter);
app.use("/roles", rolesRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/menu", menuRouter);
app.use("/review", reviewRouter);
app.use("/invoices", invoiceRouter);
app.use("/tags", tagsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is set
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

module.exports = app;
