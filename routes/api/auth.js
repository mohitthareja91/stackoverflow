const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const jsonwt = require("jsonwebtoken");
const key = require("../../setup/myurl");

router.get("/", (req, res) => {
  res.json({ test: "This is auth route" });
});

//Importiong person schema

const Person = require("../../models/Person");

// @type    Post
//@route    /api/auth/register
// @desc    Registering the user and return new user back
// @access  PUBLIC

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then((person) => {
      if (person)
        return res
          .status(400)
          .json({ error: "Email already exists in our system" });
      else {
        const newPerson = new Person({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newPerson.password = hash;
            newPerson
              .save()
              .then((person) => res.status(200).json(person))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// @type    POST
//@route    /api/auth/login
// @desc    Check user login
// @access  PUBLIC

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email })
    .then((person) => {
      if (!person) {
        return res
          .status(400)
          .json({ error: "user don't exist in our system" });
      }
      bcrypt.compare(password, person.password).then((IsCorrect) => {
        if (IsCorrect) {
          //return res.status(200).json("user is able to login in successfully");
          const PayLoad = {
            id: person.id,
            name: person.name,
            email: person.email,
          };
          var token = jsonwt.sign(PayLoad, key.secret, { expiresIn: "1h" });
          res.json({ token: "Bearer " + token });
        } else {
          return res.status(400).json({ Error: "InCorrect Password" });
        }
      });
    })
    .catch((err) => console.log(err));
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic,
    });
  }
);
module.exports = router;
