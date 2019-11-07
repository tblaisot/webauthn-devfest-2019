import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {RegisterPage} from "./pages/register/Register.result";
import {LoginPage} from "./pages/login/Login.result";
import {SecretPage} from "./pages/secret/Secret";
import {NotFound} from "./pages/notfound/NotFound";
import {useAuth} from "./services/Auth.result";

export const Routes = () => {
  const {
    isAuthenticated
  } = useAuth();
  return (
    <Switch>
      <Route path="/signup">
        {isAuthenticated ? <Redirect to="/secretpage"/> : <RegisterPage />}
      </Route>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/secretpage"/> : <LoginPage />}
      </Route>
      <Route path="/secretpage">
        {isAuthenticated ? <SecretPage /> : <Redirect to="/login"/>}
      </Route>
      <Route><NotFound/></Route>
    </Switch>
  );
};
