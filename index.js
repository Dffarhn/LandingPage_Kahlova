const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const { route } = require("./src/Router/route.js");
const { supabase } = require("./config.js");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;
app.use(cors)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(route);

app.get("/", (req, res) => {
  res.send("halo world");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
