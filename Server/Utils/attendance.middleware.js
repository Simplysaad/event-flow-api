function attendanceMiddleware(req, res, next) {
    let { currentUser } = req;
    if (!currentUser) {
        return res.status(401).json({
            success: false,
            message: "user had not registered, redirect to attendance page"
        });
    }
    next();
}
module.exports = attendanceMiddleware;
