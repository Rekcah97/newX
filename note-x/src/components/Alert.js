import React from "react";

const Alert = (props) => {
  const capitalize = (word) => {
    if (word === "danger") {
      word = "Error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  return (
    <>
      <div style={{ height: "50px" }}>
        {props.alert && (
          <div>
            <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
              {capitalize(props.alert.type)} : {capitalize(props.alert.msg)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Alert;
