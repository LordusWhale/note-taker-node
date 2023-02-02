const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	max: 3, 
	handler: function(req, res) {
        return res.status(429).json({
            message: "Too many accounts created"
        })
    }
})

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 3, 
    handler: function(req, res) {
        return res.status(429).json({
            message: "Too many login attempts try again later"
        })
    }
})

module.exports = { createAccountLimiter, loginLimiter };
