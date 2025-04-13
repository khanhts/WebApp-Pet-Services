const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/admin", adminRoutes);

app.listen(5000, () => {
    console.log("🚀 Server chạy tại http://localhost:5000");
});