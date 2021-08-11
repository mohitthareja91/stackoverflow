const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const ObjectId = require("mongodb").ObjectID;

//Load person model

const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Profile Model
const Question = require("../../models/Question");

// @type    POST
//@route    /api/question/addquestion
// @desc    Adding question for specific user profile
// @access  Private

router.post(
  "/addquestion",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const question = new Question({
      user: req.user.id,
      textOne: req.body.textOne,
      textTwo: req.body.textTwo,
    });

    question
      .save()
      .then((question) => res.json(question))
      .catch((err) =>
        console.log("Error coming in adding question" + question)
      );
  }
);

router.post(
  "/upvote/:q_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var id = req.params.q_id;

    Question.findOne({ _id: id })
      .then((question) => {
        if (!question)
          res
            .status(400)
            .json({ questionNotfound: "unable to find the question" });

        const user = req.user.id;

        const userExist = question.upvotes
          .map((item) => item.user)
          .indexOf(user);
        console.log(userExist);
        if (userExist !== -1) question.upvotes.push(user);
        else res.status(400).json({ alreadyExist: "user already exist" });

        question
          .save()
          .then((question) => res.json(question))
          .catch((err) => console.log("Error occured in saving upvote" + err));
      })
      .catch((err) => console.log(err));
  }
);

router.post(
  "/comment/:q_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var id = req.params.q_id;

    Question.findOne({ _id: id })
      .then((question) => {
        if (!question)
          res
            .status(400)
            .json({ questionNotfound: "unable to find the question" });

        const user = req.user.id;

        const newComment = {};

        newComment.comment = req.body.comment;
        newComment.user = user;

        question.comments.push(newComment);

        question
          .save()
          .then((question) => res.json(question))
          .catch((err) =>
            console.log("Error occured in saving comment " + err)
          );
      })
      .catch((err) => console.log(err));
  }
);

// @type    GET
//@route    /api/question/
// @desc    Questions for specific user
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find({ user: req.user.id })
      .populate("user", ["username", "profilePic"])
      .populate("comments.user", ["username", "profilepic"])
      .populate("upvotes.user", ["username", "profilepic"])
      .then((question) => {
        if (!question)
          res
            .status(400)
            .json({ questionnotfound: "unable to find questions" });
        res.json(question);
      })
      .catch((err) => console.log("Error occurred in finding questions" + err));
  }
);
module.exports = router;

//60f7c71b3ff3fa4c180d26c5
