const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    category: {
        type: String
        //enum: ["summit", "competition", "show", "ceremony"],
        //default: "show"
    },
    logo: {
        type: String,
        default: "https://placehold.co/400"
    },

    tickets: [
        {
            title: {
                type: String
            },
            totalCount: {
                type: Number,
                default: 0
            },
            availableCount: {
                type: Number,
                default: 0
            },
            purchaseCount: {
                type: Number,
                default: 0
            },
            price: {
                type: Number,
                default: 0
            },
            type: {
                type: String,
                enum: ["vip", "early bird", "regular"], //should be customizeable
                default: "regular"
            }
        }
    ],
    location: {
        type: String
    },
    description: {
        type: String,
        default: "a very outstanding event"
    },
    date: {
        type: Date
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    schedule: [
        {
            name: String,
            handler: String,
            description: String,
            time: Date,
            duration: String,
            media: [
                {
                    name: String,
                    url: String
                }
            ],
            completed: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                enum: ["done", "current", "upcoming"]
            }
        }
    ]
});

example = {
    name: "jihad week",
    category: "public event",
    venue: "oduduwa hall",
    dateTime: new Date("2024-03-12T12:34Z"),
    schedule: [
        {
            title: "Keynote address",
            handler: "Dr Kasali Rahman",
            description: "The blooming doom",
            time: new Date("2025-05-28T09:00Z"),
            media: [
                {
                    title: "blooming doom.pptx",
                    url: "https://res.cloudinary.com/blooming-doom.pptx"
                }
            ],
            completed: false
        },
        {
            title: "Opening lecture",
            handler: "Prof. MAO Rahman",
            description: "The blooming doom",
            time: new Date("2025-05-28T09:00Z"),
            media: [
                {
                    title: "blooming doom.pptx",
                    url: "https://res.cloudinary.com/blooming-doom.pptx"
                }
            ],
            completed: true
        }
    ]
};

const event = new mongoose.model("event", eventSchema);
module.exports = event;
