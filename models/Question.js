const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "mypersonSchema",
  },

  textOne: {
    type: String,
    required: true,
  },

  textTwo: {
    type: String,
    required: true,
  },

  upvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "mypersonSchema",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "mypersonSchema",
      },
      comment: { type: String, required: true },
    },
  ],
});

module.exports = Question = mongoose.model("myQuestionSchema", questionSchema);
