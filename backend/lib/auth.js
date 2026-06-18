const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRE_IN = process.env.JWT_EXPIRES_IN || '8h';

module.exports.signToken = function(user) {
    // payload: only safe data
    // )token is base64-decodable
    return jwt.sign(
        { sub: user.id, vloga: user.vloga },
        SECRET,
        { expiresIn: EXPIRE_IN }
    );
};

module.exports.verifyToken = function(token) {
    return jwt.verify(token, SECRET); // throws if the signature is invalid or expired
};