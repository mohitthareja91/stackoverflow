const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "mypersonSchema",
  },

  username: {
    type: String,
    required: true,
    max: 50,
  },
  website: {
    type: String,
  },
  country: {
    type: String,
  },
  Programminglanguages: {
    type: [String],
    required: true,
  },
  portfolio: {
    type: String,
  },

  workRole: [
    {
      role: { type: String, required: true },
      company: { type: String },
      country: { type: String },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
    },
  ],

  social: {
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
  },
});

module.exports = Profile = mongoose.model("MyProfile", ProfileSchema);
