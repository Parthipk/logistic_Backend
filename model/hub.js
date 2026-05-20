const mongoose = require("mongoose");

const hubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hub", hubSchema);