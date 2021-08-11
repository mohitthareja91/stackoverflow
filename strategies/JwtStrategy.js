var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const key = require("../setup/myurl").secret;
const mongoose = require("mongoose");
const Person = require("../models/Person");
//var ObjectId = require("mongodb").ObjectID;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      var myId = jwt_payload.id;

      Person.findById(myId)
        .then((user) => {
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
