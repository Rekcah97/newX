import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const VerifyEmail = (props) => {
  let history = useHistory();
  const { showAlert } = props;
  const [Credential, setCredential] = useState({ otp: "" });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Check for saved timer end time in localStorage
    const savedEndTime = localStorage.getItem("otpEndTime");
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Date.now();
      const timeRemaining = endTime - now;

      if (timeRemaining > 0) {
        setIsResendDisabled(true);
        setTimer(Math.ceil(timeRemaining / 1000)); // Convert milliseconds to seconds
      } else {
        // Timer expired, reset
        localStorage.removeItem("otpEndTime");
        setIsResendDisabled(false);
        setTimer(0);
      }
    }
  }, []);

  useEffect(() => {
    let timerInterval;

    if (isResendDisabled && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isResendDisabled) {
      // Timer expired, enable resend button
      setIsResendDisabled(false);
      localStorage.removeItem("otpEndTime");
    }

    return () => clearInterval(timerInterval);
  }, [timer, isResendDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { otp } = Credential;
    const userId = localStorage.getItem("userId");

    if (!userId) {
      showAlert("User ID not found. Please log in again.", "danger");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });
      const json = await response.json();

      if (json.status === "verified") {
        history.push("/");
        showAlert("Email verified successfully", "success");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.setItem("verifiedStatus", "verified");
      } else {
        showAlert(json.message || "Incorrect verification code", "danger");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      showAlert("An error occurred while verifying email.", "danger");
    }
  };

  const onChange = (e) => {
    setCredential({ ...Credential, [e.target.name]: e.target.value });
  };

  const handleResend = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");

    if (!userId || !email) {
      showAlert("User ID or email not found. Please log in again.", "danger");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/resendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });
      const json = await response.json();

      if (json.status === "sent") {
        // Set end time 1 minute from now
        const endTime = Date.now() + 60 * 1000;
        localStorage.setItem("otpEndTime", endTime);
        setIsResendDisabled(true);
        setTimer(60); // Set timer for 1 minute (60 seconds)
        showAlert("Verification code was resent", "success");
      } else {
        showAlert(json.message || "An error occurred while resending the code", "danger");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showAlert("An error occurred while resending the OTP.", "danger");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="acontainer">
          <div className="text">
            <h1>Verify Your Email</h1>
            <p>Check your email. A code has been sent to your email address.</p>
          </div>
          <div className="border-bottom border-top pd-3 ainputcontainer">
            <label htmlFor="otp" className="mt-3">
              <b>Code</b>
            </label>
            <input type="text" placeholder="Enter the verification code" value={Credential.otp} onChange={onChange} name="otp" id="otp" aria-describedby="nameotp" required className="ainput" minLength={4} maxLength={4} />
          </div>
          <p className="my-3">
            Didn't receive a verification code?{" "}
            <button onClick={handleResend} className="link" disabled={isResendDisabled}>
              {isResendDisabled ? `Resend (${timer}s)` : "Resend"}
            </button>
          </p>
          <button type="submit" className="registerbtn">
            Verify
          </button>
        </div>
      </form>
    </>
  );
};

export default VerifyEmail;
