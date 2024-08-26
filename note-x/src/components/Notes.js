import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";

const Notes = (props) => {
  const { showAlert } = props;
  // defining and importing context and note
  const context = useContext(noteContext);
  const { notes, getAllNote, editNote, deleteNote } = context;
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  // using it as component did mount
  useEffect(() => {
    getAllNote();
    // eslint-disable-next-line
  }, []);

  // updating note
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
  };

  // on clicking trash icon
  const onDelete = (e) => {
    deleteNote(note.id);
    refClose.current.click();
    showAlert("Note Deleted successfully", "success");
  };

  // enable us to edit in input
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // updating notes
  const handleAdd = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    showAlert("Note Updated successfully", "success");
  };

  //ref
  const ref = useRef(null);
  const refClose = useRef(null);

  return (
    <>
      <AddNote showAlert={showAlert} />

      {/* here is the code that helps us to popup edit note menu */}
      <div className="editing-note">
        <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editNote" ref={ref}>
          This is a dummy button
        </button>
        <div className="modal fade" id="editNote" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ top: "5.95%" }}>
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="container">
                <form>
                  {/* title and icons */}
                  <div className="modal-header border-0">
                    <div className="mb-3">
                      {/* title */}

                      <input type="text" placeholder="Your title here" className="editmode form-control border-0 fs-1" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle} style={{ fontWeight: "bold" }} required />
                      {/* Close button */}
                      <div className="icons border-bottom">
                        <button type="button" className="btn " data-bs-dismiss="modal" ref={refClose}>
                          <i className="fa-solid fa-x" data-bs-dismiss="modal" ref={refClose}></i>
                        </button>
                        {/* save button */}
                        <button type="button" className="btn" onClick={handleAdd}>
                          <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                        {/* delete button */}
                        <button type="button" className="btn" onClick={onDelete}>
                          <i className="fa-solid fa-trash "></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      {/* description part */}

                      <textarea type="text" className="form-control border-0 editmode asize" id="edescription" name="edescription" onChange={onChange} value={note.edescription} required />
                    </div>
                    {/* <div className="mb-3">
                       tag part
                      <label htmlFor="etag" className="form-label editmode">
                        Tag
                      </label>
                      <input type="text" className="form-control border-0 editmode" id="etag" name="etag" onChange={onChange} value={note.etag} />
                    </div>*/}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* here is the code that is helping us to display all notes */}
      <div className="note-cards">
        <div className="container my-3">
          <h3>Your notes</h3>
          <div className="row my-3">
            <div className="emptynote mx-1">
              <h2 style={{ color: "#696969" }}>{notes.length === 0 && "No Notes To be Found !!!!"}</h2>
            </div>
            {notes.map((notes) => {
              return <Noteitem showAlert={showAlert} key={notes._id} updateNote={updateNote} note={notes} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notes;
