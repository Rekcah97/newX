import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";

import Login from "./components/Login";
import Termsprivacy from "./components/Termsprivacy";
import Regis from "./components/Regis";
import { useState } from "react";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const [alert, setAlert] = useState(null);
  // const [confirm, setConfirm] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  // const showConfirm = (title, action, click) => {
  //   setConfirm({
  //     title: title,
  //     action: action,
  //     click: click,
  //   });
  // };
  return (
    <>
      <NoteState>
        <Router>
          <NavBar showAlert={showAlert} />
          <Alert alert={alert} />

          <div className="container my-3">
            <Switch>
              <Route exact path="/">
                <Home showAlert={showAlert} />
              </Route>
              <Route exact path="/About">
                <About />
              </Route>
              <Route exact path="/login">
                <Login showAlert={showAlert} />
              </Route>
              <Route exact path="/signup">
                <Regis showAlert={showAlert} />
              </Route>
              <Route exact path="/termprivacy">
                <Termsprivacy />
              </Route>
              <Route exact path="/verifyemail">
                <VerifyEmail showAlert={showAlert} />
              </Route>
            </Switch>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
