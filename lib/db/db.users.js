const {addSingleJsonDb, getAllJsonDb} = require('./db')
const { v4: uuidv4 } = require('uuid');
const USER_DB_PATH = "./db/users.json"

const addUser = async (user) => {
    const newUser = {...user, id: uuidv4()}
    await addSingleJsonDb(USER_DB_PATH, newUser);
    return newUser;
}


const getSingleUser = async (username) => {
    const users = await getAllJsonDb(USER_DB_PATH);
    return users.find(user=>{
        return user.username === username
    })
}



module.exports = {addUser, getSingleUser};