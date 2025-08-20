const JWT = require('jsonwebtoken');

const secret = 'jetha&babita';

function createTokenForUser (user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    }
    const token = JWT.sign(payload, secret,)    // isme ham expiry bhi daal skte hai
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret)
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}