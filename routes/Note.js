const express = require("express");
const router = express.Router();
const {addNote, getAllPublicNotes, getAllUserNotes, deletePublicNote, deleteUserNote} = require('../lib/db/db.notes');

router.post('/', async (req, res) => {
    const {title, text} = req.body;
    await addNote({title, text});
    res.sendStatus(200);
})

router.get('/', getUser, async (req, res) => {
    let notes = await getAllPublicNotes();
    res.json(notes);
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params
    if (!id) return res.sendStatus(400);
    await deletePublicNote(id);
    res.sendStatus(200);
})


module.exports = router;