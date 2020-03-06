const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const decode = jwt.verify(token.split(" ")[1], "ssshhh!randomSecrateString..");
        req.userData = decode;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}