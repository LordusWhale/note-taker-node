const { verifyJwt, signJwt } = require("../lib/jwt");
const { getSession } = require("../lib/db/db.sessions");
require("dotenv").config()
async function getUser(req, res, next) {
  const { authToken, refreshToken } = req.signedCookies;
  if (!authToken) return next();
  const { user, expired } = verifyJwt(authToken);
  if (user) {
    req.user = user;
    return next();
  }

  const { user: refresh } =
    expired && refreshToken ? verifyJwt(refreshToken) : { user: null };
  if (!refresh) {
    return next();
  }
  const session = await getSession(refresh.sessionId);

  if (!session) {
    return next();
  }

  const newToken = signJwt(session, "10h");
  res.cookie("authToken", newToken, {
    httpOnly: true,
    sameSite: 'strict',
    signed: true
  });
  req.user = verifyJwt(newToken).user;
  return next();
}

module.exports = {getUser};