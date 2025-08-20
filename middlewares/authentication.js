const { next } = require("express");
const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie (cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
           return next()              // This double next() can cause two different route handlers to run for the same request, leading to two responses being sent, which triggers the “headers already sent” error.
        }                    // THAT IS WHY RETURN next() IS USED HERE

        try{
            const userPayload = validateToken(tokenCookieValue);    
            req.user = userPayload;
        }
        catch(error) {}
        next()
    }
}


module.exports = {
    checkForAuthenticationCookie
}