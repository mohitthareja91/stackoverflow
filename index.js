const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//initialise the middleware

app.use(passport.initialize());

require("./strategies/JwtStrategy.js")(passport);

const auth = require("./routes/api/auth");

console.log(require("./models/Person"));
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");

const db = require("./setup/myurl.js").mongoURL;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongo db connected successfully"))
  .catch((err) => console.log("error is " + err));

app.get("/", (req, res) => {
  res.send("bigstack project coming up 2-3 days 123345");
});

app.use("/api/profile", profile);
app.use("/api/auth", auth);
app.use("/api/question", question);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App listening on port 3000!");
});
