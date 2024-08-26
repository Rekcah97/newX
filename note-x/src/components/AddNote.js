import React, { useContext, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const { showAlert } = props;
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const handleAdd = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    refClose.current.click();
    setNote({ title: "", description: "", tag: "" });
    showAlert("Note Added successfully", "success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const refClose = useRef(null);
  return (
    <>
      {/* here is the code that helps us to popup edit note menu */}
      <div className="editing-note container">
        <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addNote">
          Add Note <i className="fa-solid fa-plus fa-xs"></i>
        </button>
        <div className="modal fade" id="addNote" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true" style={{ top: "5.95%" }}>
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="container">
                <form>
                  {/* title and icons */}
                  <div className="modal-header border-0">
                    <div className="mb-3">
                      <h3 className="modal-title mx-1 border-bottom pb-3">Add a New Note</h3>
                      {/* title */}

                      <input type="text" placeholder="Your title here" className="editmode form-control border-0 fs-1 pt-2" id="title" name="title" aria-describedby="emailHelp" onChange={onChange} style={{ fontWeight: "bold" }} value={note.title} autocomplete="false" required />
                      {/* Close button */}
                      <div className="icons border-bottom">
                        <button type="button" className="btn " data-bs-dismiss="modal" ref={refClose}>
                          <i className="fa-solid fa-x" data-bs-dismiss="modal" ref={refClose}></i>
                        </button>
                        {/* save button */}
                        <button disabled={note.title.length < 5 || note.description.length < 5} type="button" className="btn " onClick={handleAdd}>
                          <i className="fa-solid fa-floppy-disk"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3 ">
                      {/* tag part */}

                      <input type="text" placeholder="Tags.." className="form-control border-0 editmode" id="tag" name="tag" value={note.tag} onChange={onChange} autocomplete="false" required />
                    </div>
                    <div className="mb-3 border-top pt-3">
                      {/* description part */}

                      <textarea placeholder="Your text here..." type="text" className="form-control border-0 editmode asize" id="description" value={note.description} name="description" onChange={onChange} />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNote;
