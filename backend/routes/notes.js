const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : Get the notes from database: get "/api/notes/fetchallnotes". require login

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }); //req.user has our user because of fetchuser
    res.json(notes);
  } catch (error) {
    //catching errors
    console.error(error.message);
    res.status(500).send("Internal Server occured");
  }
});

// ROUTE 2 : add a notes : POST "/api/notes/fetchallnotes". require login

router.post(
  "/addnotes",
  fetchuser,
  [
    //making sure title  & description is not empty
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid email").isLength({ min: 3 }),
  ],
  async (req, res) => {
    //destructuring the data gotten
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    // if our data is not valid then we send a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      //catching errors
      console.error(error.message);
      res.status(500).send("Internal Server occured");
    }
  }
);
// ROUTE 3 : Update a existing note: PUT "/api/notes/updatenote/:id". require login

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    //destructuring the data gotten
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
  } catch (error) {
    //catching errors
    console.error(error.message);
    res.status(500).send("Internal Server occured");
  }
});

// ROUTE 4 : Delete a existing note: delete "/api/notes/deletenote". require login

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be Deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //check if the note belongs to the user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: " Note has been delete" });
  } catch (error) {
    //catching errors
    console.error(error.message);
    res.status(500).send("Internal Server occured");
  }
});

module.exports = router;
