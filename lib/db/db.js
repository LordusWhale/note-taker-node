const fs = require('fs');

const addSingleJsonDb = async (path, note) => {
    const allNotes = await getAllJsonDb(path);
    const newNotes = [note, ...allNotes];
    try {
        await fs.promises.writeFile(path, JSON.stringify(newNotes));
    } catch(err) {
        console.log(err);
    }
}
const getAllJsonDb = async (path) => {
    let notes;
    if (fs.existsSync(path)) {
        try {
            notes = await (fs.promises.readFile(path, 'utf-8'));
            notes = JSON.parse(notes);
        } catch(err) {
            notes = [];
        }
    } else {
        notes = [];
    }
    return notes;
}


module.exports = {addSingleJsonDb, getAllJsonDb};