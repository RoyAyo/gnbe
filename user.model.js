const { Schema, model } = require("mongoose")

const UserSchema = new Schema(
  {
    name: String,
    code: String,
    comingFrom: String,
    group: Number,
    fakeGroup: Number,
    isFake: Boolean
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);