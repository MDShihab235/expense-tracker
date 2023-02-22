const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "./config.env" });
}

// require('dotenv').config({ path : "./config.env"});
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const con = require("./db/connection.js");

// using routes
app.use(require("./routes/route"));

con
  .then((db) => {
    if (!db) return process.exit(1);

    // listen to the http server
    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });

    app.on("error", (err) =>
      console.log(`Failed To Connect with HTTP Server : ${err}`)
    );
    // error in mondb connection
  })
  .catch((error) => {
    console.log(`Connection Failed...! ${error}`);
  });

// // all your routes should go here
// app.use(
//   "/some-route",
//   require(path.join(__dirname, "api", "routes", "route.js"))
// );

// static files (build of your frontend)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client", "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}
