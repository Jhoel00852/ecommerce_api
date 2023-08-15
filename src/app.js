const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const multer = require("multer")
const path = require("path")

const apiRoutes = require("./routes");
const errorRoutes = require("./routes/error.routes");

const app = express();

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: path.join(__dirname, "../public"),
//     filename : (req, file, callback) => {
//       //callback es error first
//       const date = Date.now()
//       callback(null, `${date}-${file.originalname}`);
//     }
//   }),
//   limits: {
//     fileSize: 5000000
//   }
// })

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

apiRoutes(app);

app.use("/public/images/",express.static(path.join(__dirname, "../public/images/")))

// app.post("/files", upload.single("profileImage"), async(req, res) => {
//   try {
//     const {file} = req;
//     console.log(file)
//   file ? res.json("correct") : res.status(400).json("image no correct")


//   } catch (error) {
//     res.json(error)
//   }
// })

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a mi app",
  });
});

errorRoutes(app);

module.exports = app;

// $2b$10$C/i8/EVDWgZokvsLFtGBi.jv9nT2XrrPX1Z9HtTz5k5eAfcwE17sG
