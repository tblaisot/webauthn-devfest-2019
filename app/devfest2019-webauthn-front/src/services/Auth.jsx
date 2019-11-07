import React, { createContext, useContext, useState } from "react";
import {
  getWebAuthnLoginChallenge,
  getWebAuthnRegistrationChallenge,
  sendLogout,
  sendPasswordLogin,
  sendPasswordRegister,
  sendWebAuthnResponse
} from "./AuthApi";
import {
  preformatGetAssertReq,
  preformatMakeCredReq,
  publicKeyCredentialToJSON
} from "../utils/utils";

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const logInPassword = async userLogin => {
    setLoading(true);
    try {
      const response = await sendPasswordLogin(userLogin);
      const user = response.user;
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      alert("Error logging in please try again");
    }
    setLoading(false);
  };

  const signInPassword = async userRegistration => {
    setLoading(true);
    try {
      const response = await sendPasswordRegister(userRegistration);
      const user = response.user;
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      alert("Error logging in please try again");
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await sendLogout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error(err);
      alert("Error logging out in please try again");
    }
    setLoading(false);
  };

  // //////////////////////////////////////////////////////////////
  // WEBAUTHN
  // //////////////////////////////////////////////////////////////

  const logInWebAuthn = async userLogin => {
    setLoading(true);
    try {
      // TODO
    } catch (err) {
      console.error(err);
      alert("Error logging in please try again");
    }
  };

  const signInWebAuthn = async userRegistration => {
    setLoading(true);
    try {
      // TODO
    } catch (err) {
      console.error(err);
      alert("Error logging in please try again");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signInPassword,
        logInPassword,
        logInWebAuthn,
        signInWebAuthn,
        logOut,
        user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
