const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { addUser, getSingleUser } = require("../lib/db/db.users");
const {createSession, removeSession} = require("../lib/db/db.sessions")
const { signJwt } = require("../lib/jwt");
const { getUser } = require("../middleware/getUser");
const { createAccountLimiter, loginLimiter } = require("../middleware/rateLimiter");




router.post("/register", createAccountLimiter,  (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, async (err, encrypted) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (await getSingleUser(username))
      return res.status(406).json({ message: "Username already exists" });

    const user = await addUser({username, password: encrypted});
    const session = await createSession(user.username, user.id);
    const refreshToken = signJwt({sessionId: session.sessionId}, "1y");
    const authToken = signJwt(session, "5s");
    return res
      .cookie("authToken", authToken, {
        httpOnly: true,
        sameSite: "strict",
        signed: true
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        sameSite: 'strict',
        signed: true
      })
      .json({user: username});
  });
});

router.post("/login", loginLimiter,  async (req, res) => {
  const { username, password } = req.body;
  const user = await getSingleUser(username);
  if (!user) return res.status(403).json({ message: "User does not exist" });
  bcrypt.compare(password, user.password, async (err, same) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!same) return res.status(403).json({ message: "Incorrect password" });
    const session = await createSession(user.username, user.id);
    const refreshToken = signJwt({sessionId: session.sessionId}, "1y");
    const authToken = signJwt(session, "10h");
    res.cookie("authToken", authToken, {
      httpOnly: true,
      sameSite: "strict",
      signed: true
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      sameSite: 'strict',
      signed: true
    })
    res.json({user: username});
  });
});
router.get('/', getUser, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.json({loggedIn: false})
  }
  return res.json({loggedIn: true,  username: req.user.username});
})

router.delete('/', getUser, async (req, res) => {
  if (req.user) {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    await removeSession(req.user.sessionId);
    return res.sendStatus(200);
  }
  res.sendStatus(406);
})



module.exports = router;