const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expiresIn = '1h') => {
    console.log(payload);
    return jwt.sign(payload, process.env.jwtKey, { expiresIn });
};

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.jwtKey);
        return decoded;
    } catch (error) {
        // Handle invalid/expired tokens here
        return null;
    }
}