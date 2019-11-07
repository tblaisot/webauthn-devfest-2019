import React from "react";
import {useForm} from "../../hooks/useForm";
import {Button, Form, Tab, Tabs} from "react-bootstrap";
import "./Login.css";
import {useAuth} from "../../services/Auth";
import {Camera} from "../../components/Camera";

export const LoginPage = () => {
  const {logInPassword, logInWebAuthn} = useAuth();

  return (
    <div className="Login">
      <Tabs defaultActiveKey="password">
        <Tab eventKey="password" title="Password">
          <LoginPassword logInPassword={logInPassword}></LoginPassword>
        </Tab>
        <Tab eventKey="profile" title="WebAuthn">
          <div className="container">
            <div className="row">
              <div className="col-sm">
                <LoginWebAuthn logInWebAuthn={logInWebAuthn}></LoginWebAuthn>
              </div>
              <div className="col-sm">
                <Camera/>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const LoginPassword = ({logInPassword}) => {
  const {
    values,
    handleChange,
    handleSubmit
  } = useForm(
    {
      login: "",
      password: ""
    },
    logInPassword
  );

  const isValid =
    values.login &&
    values.login.length > 0 &&
    (values.password && values.password.length > 0);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="login">
        <Form.Label>Login</Form.Label>
        <Form.Control
          required
          autoFocus
          type="text"
          name="login"
          value={values.login}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          required
          value={values.password}
          onChange={handleChange}
          type="password"
          name="password"
        />
      </Form.Group>
      <Button block disabled={!isValid} type="submit">
        Login
      </Button>
    </Form>
  );
};

const LoginWebAuthn = ({logInWebAuthn}) => {
  // TODO
};
