const mongoose = require("mongoose");
const schema = mongoose.Schema;

const personSchema = new schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String },
  profilePic: {
    type: String,
    default:
      "https://png.pngtree.com/png-clipart/20190614/original/pngtree-cool-man-icon-png-image_3732068.jpg",
  },
  date: { type: Date, default: Date.now },
});

module.exports = Person = mongoose.model("mypersonSchema", personSchema);
