const express = require("express");
const cors = require("cors");
const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();
const { sendEmail } = require("./node-mailer");
const fs = require("fs")

console.log(fs.readFileSync("./web-dwb-pem.pem"))

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./"));

// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`V Server is running on port ${PORT}.`);
});

// SUBMIT COMPLAIN
app.post("/api/complain", (req, res) => {
  try {
    const { name, email, company, floor, unit, phone, complainCategory, description } =
      req.body;
    if (Object.keys(req.body).length == 8) {
      const id = uuidv4();
      const addData = db.query(
        "insert into complains (id, name, email, company, floor, unit, phone, complainCategory, description, createdAt) values (?,?,?,?,?,?,?,?,?,NOW())",
        [id, name, email, company, floor, unit, phone, complainCategory, description],
        async (err, row) => {
          if (row) {
            req.body.id = id;
            console.log("success add row.");

            await sendEmail(req.body);

            res.json({
              statusCode: 201,
              message: "success add row.",
              data: req.body,
            });
          } else {
            console.log("error when add row.");
            console.log(err);
            res.json({
              statusCode: 403,
              message: error,
            });
          }
        }
      );
    } else {
      console.log("all fields are required");
      res.json({
        message: "all fields are required",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: error,
    });
  }
});

// GET COMPLAINS
app.get("/api/complain", (req, res) => {
  try {
    const getData = db.query("select * from complains", (err, rows) => {
      if (rows) {
        console.log("200 success retrieves");
        res.json({
          statusCode: 200,
          message: "success retrieve complains",
          dataCount: rows.length,
          data: rows,
        });
      } else {
        console.log("error when add row.");
        console.log(err);
        res.json({
          statusCode: 403,
          message: error,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: error,
    });
  }
});
