const express = require("express");
const DB_CONNECT = require("./database/db_connection");
const router = require("./router/v1/index");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// database connection
DB_CONNECT();

// routes
app.use("/api/v1/", router);

// server
app.listen(PORT, () => {
  console.log(`Server running in localhost : http://localhost:${PORT}`);
});