const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    role: {
        type: String,
        enum: ["organizer", "audience", "speaker", "participant"],
        default: "audience"
    },
    industry: {
        type: String
    },
    phoneNumber: {
        type: String
        // unique: true,
    },
    emailAddress: {
        type: String,
        unique: true
    },
    eventsAttended: [{
      type: mongoose.Schema.Types.ObjectId
       , ref: "events"
    }],
    password: {
        type: String,
        default: null
    },
    address: {
        type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

let user = new mongoose.model("user", userSchema)
module.exports = user