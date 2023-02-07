const fs = require("fs");
const { getAllJsonDb, addSingleJsonDb } = require("./db");
const { v4: uuidv4 } = require('uuid');
const SESSION_DB_PATH = "./db/sessions.json";
const createSession = async (username, id) => {
  const session = { sessionId: uuidv4() , username, id };
  await addSingleJsonDb(SESSION_DB_PATH, session);
  return session;
};

const getSession = async (sessionId) => {
  const sessions = await getAllJsonDb(SESSION_DB_PATH);
  const foundSession = sessions.find((session) => {
    return session.sessionId === sessionId;
  });
  return foundSession ? foundSession : null;
};

const removeSession = async (sessionId) => {
  const sessions = await getAllJsonDb(SESSION_DB_PATH);
  const removedSession = sessions.filter((session) => {
    return session.sessionId !== sessionId;
  });
  try {
    await fs.promises.writeFile(SESSION_DB_PATH, removedSession);
  } catch (err) {
    return;
  }
};

module.exports = { createSession, getSession, removeSession };
