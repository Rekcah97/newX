import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const { note, updateNote, showAlert } = props;
  const context = useContext(noteContext);
  const { deleteNote } = context;

  return (
    <>
      <div className="col-md-3 my-3  ">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <h6>
              <span className="badge bg-primary">{note.tag}</span>
            </h6>

            <p className="card-text">{note.description} </p>
            <i
              className="fa-solid fa-trash "
              onClick={() => {
                deleteNote(note._id);
                showAlert("Note delteted successfully", "success");
              }}
            ></i>
            <i
              className="fa-regular fa-pen-to-square mx-3"
              onClick={() => {
                updateNote(note);
              }}
            ></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default Noteitem;
