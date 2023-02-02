const fs = require('fs');
const {getAllJsonDb, addSingleJsonDb} = require('./db');
const crypto = require('crypto')
const NOTE_DB_PATH = "./db/db.json"


const addNote = async (note) => {
    addSingleJsonDb(NOTE_DB_PATH, {...note, id: crypto.randomUUID()});
}


const getAllPublicNotes = async () => {
    const allNotes = await getAllJsonDb(NOTE_DB_PATH);
    const publicNotes = allNotes.filter(note=>{
        return !note.userId;
    })
    return publicNotes;
}
const getAllUserNotes = async (userId) => {
    const allNotes = await getAllJsonDb(NOTE_DB_PATH)
    const userNotes = allNotes.filter(note=>{
        return note.userId === userId;
    })
    return userNotes;
}

const deletePublicNote = async (noteId) => {
    const allNotes = await getAllJsonDb(NOTE_DB_PATH);
    const newNotes = allNotes.filter(note=>{
        if (note.id === noteId && note.userId === null) {
            return;
        } else {
            return note;
        }
    })
    try {
        await fs.promises.writeFile(NOTE_DB_PATH, JSON.stringify(newNotes));
    } catch(err) {
        console.log(err);
    }
}
const deleteUserNote = async (noteId, userId) => {
    const allNotes = await getAllJsonDb(NOTE_DB_PATH);
    const newNotes = allNotes.filter(note=>{
        if (note.id === noteId && note.userId === userId) {
            return;
        } else {
            return note;
        }
    })
    try {
        await fs.promises.writeFile(NOTE_DB_PATH, JSON.stringify(newNotes));
    } catch(err) {
        console.log(err);
    }
}

module.exports = {addNote, getAllPublicNotes, getAllUserNotes, deletePublicNote, deleteUserNote};