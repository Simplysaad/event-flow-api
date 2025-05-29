/**
 * Event Router
 *
 * Handles routes related to events, attendance, and authentication.
 *
 * @module routes/eventRouter
 */

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Events = require("../Models/event.model.js");
const Users = require("../Models/user.model.js");

const { joinDateTime } = require("../utils/helper.js");
const authMiddleware = require("../Utils/auth.middleware.js");
const attendanceMiddleware = require("../Utils/attendance.middleware.js");

/**
 * Create a new event.
 *
 * @route POST /events
 * @access Private (Organizers only)
 * @param {Object} req.body - Event details.
 * @returns {Object} Newly created event.
 */
router.post("/events", authMiddleware, async (req, res, next) => {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ success: false, message: "nothing is being sent" });
        }
        let newEvent = new Events({ ...req.body });
        await newEvent.save();
        return res.status(201).json({
            success: true,
            message: "event created successfully",
            newEvent
        });
    } catch (err) {
        console.error("Error registering event:", err);
        next(err);
    }
});

/**
 * Update an existing event.
 *
 * @route PUT /events/:eventId
 * @access Private (Organizers only)
 * @param {string} eventId - ID of the event to update.
 * @param {Object} req.body - Updated event details.
 * @returns {Object} Updated event.
 */
router.put("/events/:eventId", authMiddleware, async (req, res, next) => {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ success: false, message: "nothing is being sent" });
        }
        req.body.schedule?.forEach(item => {
            item.time = joinDateTime(req.body.date, item.time);
        });
        let { eventId } = req.params;
        if (eventId) {
            let updatedEvent = await Events.findOneAndUpdate(
                { _id: eventId },
                { $set: { ...req.body } }
            );
            return res.status(201).json({
                success: true,
                message: "event updated successfully",
                updatedEvent
            });
        }
    } catch (err) {
        console.error("Error updating event details:", err);
        next(err);
    }
});

/**
 * Get event details for the dashboard.
 *
 * @route GET /events/:eventId/dashboard
 * @access Private (Organizers only)
 * @param {string} eventId - ID of the event.
 * @returns {Object} Event details.
 */
router.get(
    "/events/:eventId/dashboard",
    authMiddleware,
    async (req, res, next) => {
        try {
            const currentEvent = await Events.findOne({
                _id: req.params.eventId
            }).populate("attendees");
            return res.status(200).json({
                success: true,
                message: "event retrieved successfully",
                currentEvent
            });
        } catch (err) {
            console.error("Error retrieving event details:", err);
            next(err);
        }
    }
);

/**
 * Register attendance for an event.
 *
 * @route POST /events/:eventId/attendance
 * @access Public
 * @param {string} eventId - ID of the event.
 * @param {Object} req.body - Attendee details.
 * @returns {Object} Attendee details.
 */
router.post("/events/:eventId/attendance", async (req, res, next) => {
    try {
        let { emailAddress } = req.body;
        let { eventId } = req.params;
        let currentUser = await Users.findOneAndUpdate(
            { emailAddress },
            { $set: { ...req.body }, $addToSet: { eventsAttended: eventId } },
            { new: true, upsert: true }
        );
        let currentEvent = await Events.findOneAndUpdate(
            { _id: eventId },
            { $addToSet: { attendees: currentUser._id } },
            { new: true }
        ).populate("attendees");
        
        req.currentUser = currentUser;
        
        
        
        req.io.emit("attendance", { attendees: currentEvent.attendees });

        return res.status(201).json({
            success: true,
            message: "attendance registered successfully",
            currentUser
        });
    } catch (err) {
        console.error("Error registering attendance:", err);
        next(err);
    }
});

/**
 * Get event details for the event homepage.
 *
 * @route GET /events/:eventId
 * @access Public
 * @param {string} eventId - ID of the event.
 * @returns {Object} Event details.
 */
router.get("/events/:eventId", attendanceMiddleware, async (req, res, next) => {
    try {
        const currentEvent = await Events.findOne({
            _id: req.params.eventId
        });

        return res.status(200).json({
            success: true,
            message: "event retrieved successfully",
            currentEvent
        });
    } catch (err) {
        console.error("Error retrieving event details:", err);
        next(err);
    }
});

//AUTH ROUTES

/**
 * Register a new organizer.
 *
 * @route POST /register
 * @access Public
 * @param {Object} req.body - Organizer details.
 * @returns {Object} Newly created organizer.
 */
router.post("/register", async (req, res, next) => {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ success: false, message: "nothing is being sent" });
        }
        let { password } = req.body;
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword:", hashedPassword);
        let newUser = new Users({
            ...req.body,
            role: "organizer",
            password: hashedPassword
        });
        await newUser.save();
        jwt.sign({newUser}, process.env.SECRET_KEY, (err, token) => {
            if (!err) {
                console.log(token);
                req.token = token;
                res.cookie("token", token)
            } else return next(err);
        });
        return res.status(201).json({
            success: true,
            message: "organizer registered successfully",
            newUser
        });
    } catch (err) {
        console.error("Error registering organizer", err);
        next(err);
    }
});

/**
 * Login an existing user.
 *
 * @route POST /login
 * @access Public
 * @param {Object} req.body - User credentials.
 * @returns {Object} Logged in user details.
 */
router.post("/login", async (req, res, next) => {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ success: false, message: "nothing is being sent" });
        }
        let { emailAddress, password } = req.body;
        let currentUser = await Users.findOne({ emailAddress });
        if (!currentUser) {
            return res
                .status(404)
                .json({ success: false, message: "user not found" });
        }
        console.log("currentUser", currentUser);
        let isPasswordCorrect = await bcrypt.compare(
            password,
            currentUser.password
        );
        if (!isPasswordCorrect) {
            return res
                .status(403)
                .json({ success: false, message: "invalid credentials" });
        }
        jwt.sign({currentUser}, process.env.SECRET_KEY, (err, token) => {
            if (!err) {
                console.log(token);
                req.token = token;
                res.cookie("token", token)
            } else return next(err);
        });
        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            currentUser
        });
    } catch (err) {
        console.error("Error:", err);
        next(err);
    }
});

module.exports = router;
