const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    let { token } = req.session;
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "token not available, user not logged in"
        });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        req.currentUser = decoded;
        if (decoded.role === "organizer") return next();
        else {
            console.error("Access denied: insufficient permissions", err);
            return res.status(403).json({
                success: false,
                message: "Access denied: insufficient permissions"
            });
        }
    });
}
