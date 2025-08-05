import React, { useState } from "react";
import "./Authpopup.css";
import { GoogleLogin } from "@react-oauth/google";

const AuthPopup = ({ onLoginSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup-container">
        <div className="auth-popup-tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => handleTabChange("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => handleTabChange("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-popup-content">
          {activeTab === "login" ? (
            <>
              <h2>Login to bodh.ai</h2>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  onLoginSuccess(credentialResponse);
                  onClose();
                }}
                onError={() => console.error("Login Failed")}
              />
            </>
          ) : (
            <>
              <h2>Sign Up for bodh.ai</h2>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  onLoginSuccess(credentialResponse);
                  onClose();
                }}
                onError={() => console.error("Signup Failed")}
              />
            </>
          )}
        </div>
        <button className="cancel-btn" onClick={onClose}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
