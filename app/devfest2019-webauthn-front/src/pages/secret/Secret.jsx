import React from 'react';
import {useAuth} from "../../services/Auth";

export const SecretPage = () => {
  const {
    logOut,
  } = useAuth();
  return (
    <div>
      <img className="container" src="/secret.jpg" alt="A secret" />
      <button onClick={logOut}>Log Out</button>
    </div>
  )
};
