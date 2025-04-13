const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const Appointment = require("./models/Appointment");

// Import routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const appointmentsRouter = require("./routes/appointments");
const authRouter = require("./routes/auth");
const rolesRouter = require("./routes/roles");
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");
const menuRouter = require("./routes/menu");
const reviewRouter = require("./routes/review");
const invoiceRouter = require("./routes/invoices");
const tagsRouter = require("./routes/tags");
const servicesRouter = require("./routes/services");

const app = express();

// View engine (nếu bạn dùng frontend render bằng pug)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/login", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
connectDB();

// Routers
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
app.use("/services", servicesRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// General error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("❌ Server error:", err);
  res.status(statusCode).json({ error: message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
