const { Router } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load person model

const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

// @type    GET
//@route    /api/profile
// @desc    Route for personal user profile
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res
            .status(404)
            .json({ profileNotFound: "Profile don't exist in our system" });
        }
        res.json(profile);
      })
      .catch((err) => console.log("Got some error in profile" + err));
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (req.body.country) profileValues.country = req.body.country;

    if (typeof req.body.Programminglanguages !== undefined) {
      profileValues.Programminglanguages =
        req.body.Programminglanguages.split(",");
    }
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;

    console.log("user id is " + req.user.id);
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then((profile) => {
              return res.json(profile).status(200);
            })
            .catch((err) => "Error in updating profile" + console.log(err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then((profile) => {
              if (profile)
                return res
                  .status(400)
                  .json({ usernameError: "username already exists" });
              else {
                new Profile(profileValues)
                  .save()
                  .then((profile) => res.json(profile));
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
);

// @type    GET
//@route    /api/profile/:username
// @desc    Getting the profile based on username
// @access  PUBLIC

router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilePic"])
    .then((profile) => {
      if (!profile) {
        return res.status(400).json({ usernameNotFound: "username not found" });
      }
      res.status(200).json(profile);
    })
    .catch((err) => console.log("Error in finding profile via username" + err));
});

// @type    GET
//@route    /api/profile/find/everyone
// @desc    Getting all the profiles
// @access  PUBLIC

router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilePic"])
    .then((profile) => {
      if (!profile) {
        return res.status(400).json({ usernameNotFound: "username not found" });
      }
      res.status(200).json(profile);
    })
    .catch((err) => console.log("Error in finding profile via username" + err));
});

// @type    DELETE
//@route    /api/profile/
// @desc    Deleting all the profiles
// @access  Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOne({ _id: req.user.id })
          .then(res.status(200).json({ Success: "User deleted successfully" }))
          .catch((err) => console.log("Error occured in deleting profile"));
      })
      .catch();
  }
);

// @type    Post
//@route    /api/profile/workrole
// @desc    Route for Adding WorkRole
// @access  Private

router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile)
          res.status(400).json({ prfileNotfound: "Profile not found" });
        const workrole = {};

        workrole.role = req.body.role;
        workrole.company = req.body.company;
        workrole.country = req.body.country;
        workrole.current = req.body.current;

        profile.workRole.push(workrole);

        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => console.log(err));
      })
      .catch((err) =>
        console.log("Error occured in updating work role " + err)
      );
  }
);

// @type    DELETE
//@route    /api/profile/workrole/:w_id
// @desc    Deleting a workrole
// @access  Private

router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile)
          res.status(400).json({
            profileNotFound: "Unable to find profile for specific id",
          });

        const removeThis = profile.workRole
          .map((item) => item.id)
          .indexOf(req.params.w_id);

        profile.workRole.splice(removeThis, 1);

        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) =>
            console.log("Error occured while saving profile" + err)
          );
      })
      .catch((err) => console.log("Error occured while deleting route" + err));
  }
);

module.exports = router;

//60f7af724c6cd435f854775e
