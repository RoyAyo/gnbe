const mongoose = require("mongoose");

// const Chance = require('chance');
// const userModel = require("../user.model");

// const chance = Chance();

const MONGO_URI = 'mongodb://127.0.0.1:27017/games'

mongoose.Promise = global.Promise;

const db = mongoose
  .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected successfully to Database");
  })
  .catch((e) => {
    console.log(e);
});

const users = []

const generateSeed = async () => {
    for (let index = 0; index < 50; index++) {
        users.push({
            name: chance.name(),
            code: chance.integer({min: 1000, max: 9999})
        })
    }

    await userModel.insertMany(users);
    console.log("done");
}


// // Test
// generateSeed()

module.exports = db