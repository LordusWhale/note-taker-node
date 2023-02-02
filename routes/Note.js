const express = require("express");
const router = express.Router();
const {addNote, getAllPublicNotes, getAllUserNotes, deletePublicNote, deleteUserNote} = require('../lib/db/db.notes');
const { getUser } = require("../middleware/getUser");


router.post('/', getUser, async (req, res) => {
    const {title, text} = req.body;
    const user = req.user;
    await addNote({title, text, userId: user ? user.id : null});
    res.sendStatus(200);
})

router.get('/', getUser, async (req, res) => {
    const user = req.user;
    let notes = [];
    if (user) {
        notes = await getAllUserNotes(user.id)
    } else {
        notes = await getAllPublicNotes();
    }
    res.json(notes);
})

router.delete('/:id', getUser, (req, res) => {
    const {id} = req.params
    if (!id) return res.sendStatus(400);
    if (req.user) {
        deleteUserNote(id, req.user.id)
        res.sendStatus(200);
    } else {
        deletePublicNote(id)
        res.sendStatus(200);
    }
})

module.exports = router;