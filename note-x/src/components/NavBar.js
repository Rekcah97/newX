import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const NavBar = (props) => {
  const { showAlert } = props;
  const ref = useRef(null);
  const refClose = useRef(null);
  let history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    history.push("/login");
    refClose.current.click();
    showAlert("Logged Out successfully", "success");
  };
  const handleClick = () => {
    ref.current.click();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            NoteX
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/About">
                  About
                </NavLink>
              </li>
            </ul>
            <div className="d-flex">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  {!localStorage.getItem("token") ? (
                    <NavLink className="nav-link " to="/Login">
                      Login
                    </NavLink>
                  ) : (
                    <button className="nav-link logout" onClick={handleClick}>
                      LogOut
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <button type="button" className="btn btn-primary  d-none " data-bs-toggle="modal" data-bs-target="#Confirm" ref={ref}>
        This is a dummy button
      </button>

      <div className="modal fade" id="Confirm" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title my-1" id="exampleModalLongTitle">
                LogOut
              </h5>
            </div>
            <div className="modal-body my-3">Do you want to logout?</div>
            <div className="modal-footer">
              <button type="button" className="btn " data-bs-dismiss="modal" ref={refClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>
                LogOut
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
