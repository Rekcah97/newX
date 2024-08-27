import React, { useRef } from "react";

const Confirm = (props) => {
  const ref = useRef(null);

  return (
    <>
      <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#Confirm1" ref={ref}>
        dummy button
      </button>

      <div className="modal fade" id="Confirm1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title my-1" id="exampleModalLongTitle">
                {props.confirm.title}
              </h5>
            </div>
            <div className="modal-body my-3"> {props.warning}</div>
            <div className="modal-footer">
              <button type="button" className="btn " data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                {props.confirm.action}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
