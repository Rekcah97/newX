import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Login = (props) => {
  const { showAlert } = props;
  let history = useHistory();
  const [Credential, setCredential] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: Credential.email, password: Credential.password }),
    });
    const json = await response.json();
    console.log(json.success, json.auth);
    if (json.success) {
      localStorage.setItem("token", json.auth);
      history.push("/");
      showAlert("Succesfully logged in", "success");
    } else {
      showAlert("Invalid credentials", "danger");
    }
  };
  const onChange = (e) => {
    setCredential({ ...Credential, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="acontainer">
          <div className="text">
            <h1>Login</h1>
            <p>Please fill in this form to Log into your Account</p>
          </div>
          <div className="border-bottom border-top pd-3 ainputcontainer">
            <label htmlFor="email" className="mt-3 ">
              <b>Email</b>
            </label>

            <input type="email" placeholder="Enter Email" name="email" value={Credential.email} id="email" onChange={onChange} aria-describedby="emailHelp" required className="ainput" />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input type="password" placeholder="Enter Password" name="password" value={Credential.password} onChange={onChange} id="password" className="ainput mb-3" required />
          </div>
          <p className="my-3 ">
            By Logging in your account you agree to our <NavLink to="/termprivacy">Terms & Privacy</NavLink>.
          </p>

          <button type="submit" className="registerbtn">
            Login
          </button>
          <div className="signin">
            <p>
              Don't have an account? <NavLink to="/signup">Sign Up</NavLink>.
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
