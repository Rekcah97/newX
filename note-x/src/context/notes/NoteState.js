import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  // get all notes
  const getAllNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjMjI2NzJmOGI5YTk5NWI5ZmE5Mjk2In0sImlhdCI6MTcyNDAwMDE4OH0.xTcJwhFFeIUSpeRQ7TRskswj0KAymCjUUEE9uYSUtKI",
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  // add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjMjI2NzJmOGI5YTk5NWI5ZmE5Mjk2In0sImlhdCI6MTcyNDAwMDE4OH0.xTcJwhFFeIUSpeRQ7TRskswj0KAymCjUUEE9uYSUtKI",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = response.json();

    setNotes(notes.concat(note));
    getAllNote();
  };
  //delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjMjI2NzJmOGI5YTk5NWI5ZmE5Mjk2In0sImlhdCI6MTcyNDAwMDE4OH0.xTcJwhFFeIUSpeRQ7TRskswj0KAymCjUUEE9uYSUtKI",
      },
    });
    const json = response.json();
    console.log(json);

    console.log(id);
    const newNotes = notes.filter((notes) => {
      return notes._id !== id;
    });
    setNotes(newNotes);
  };
  // edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjMjI2NzJmOGI5YTk5NWI5ZmE5Mjk2In0sImlhdCI6MTcyNDAwMDE4OH0.xTcJwhFFeIUSpeRQ7TRskswj0KAymCjUUEE9uYSUtKI",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  const [notes, setNotes] = useState(notesInitial);

  return <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNote }}>{props.children}</NoteContext.Provider>;
};

export default NoteState;
