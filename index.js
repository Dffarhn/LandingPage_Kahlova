const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const { route } = require("./src/Router/route.js");
const { supabase } = require("./config.js");
const cookieParser = require('cookie-parser');

const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use(route);
app.use(cors());

app.get("/", (req, res) => {

  res.cookie('user','dapa',{ maxAge: 900000, httpOnly: true })
  res.send("halo world");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
