const jwt = require('jsonwebtoken');

require("dotenv").config()

const signJwt = (data, expiresIn) => {
    return jwt.sign(data, process.env.JWT_SECRET || "local", {expiresIn});
}
const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "local");
        return {user: decoded, expired: false}
    } catch(err) {
        return {user: null, expired: err.message.includes('expired')};
    }
   
}

module.exports = {signJwt, verifyJwt};