var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
let {CreateErrorRes} = require('./utils/responseHandler')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect("mongodb://localhost:27017/login");
mongoose.connection.on('connected',()=>{
  console.log("connected");
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const cors = require('cors');

app.use(cors({
  origin: 'http://127.0.0.1:5500', // địa chỉ frontend
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  CreateErrorRes(res,err.message,err.status||500);
});

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Appointment = require('./models/Appointment');

const appointments = require('./routes/appointments');

require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/appointments', appointments);

app.use(express.static(path.join(__dirname, 'public'))); // Chứa HTML, CSS, JS

// ✅ Kết nối MongoDB (Xử lý lỗi tốt hơn)
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/login", {

      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
}
connectDB();

// 📌 API cho FullCalendar
app.use('/appointments', require('./routes/appointments'));


// 📌 Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("❌ Lỗi server:", err);
  res.status(500).json({ message: "Có lỗi xảy ra trên server!" });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
