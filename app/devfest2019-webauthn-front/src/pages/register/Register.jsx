import React from "react";
import {useForm} from "../../hooks/useForm";
import {Button, Form, Tab, Tabs} from "react-bootstrap";
import {useAuth} from "../../services/Auth";
import "./Register.css";
import {Camera} from "../../components/Camera";

export const RegisterPage = () => {
  const {signInPassword, signInWebAuthn} = useAuth();

  return (
    <div className="Register">
      <Tabs defaultActiveKey="password">
        <Tab eventKey="password" title="Password">
          <RegisterPassword signInPassword={signInPassword}></RegisterPassword>
        </Tab>
        <Tab eventKey="profile" title="WebAuthn">
          <div className="container">
            <div className="row">
              <div className="col-sm">
                <RegisterWebAuthn signInWebAuthn={signInWebAuthn}></RegisterWebAuthn>
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

const RegisterPassword = ({signInPassword}) => {
  const {
    values,
    handleChange,
    handleSubmit
  } = useForm(
    {
      username: "",
      login: "",
      password: "",
      passwordconfirm: ""
    },
    signInPassword
  );

  const isValid =
    values.username &&
    values.username.length > 0 &&
    (values.login && values.login.length > 0) &&
    (values.password && values.password.length > 0) &&
    values.passwordconfirm === values.password;

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Name</Form.Label>
        <Form.Control
          required
          autoFocus
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
        />
      </Form.Group>
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
      <Form.Group controlId="passwordconfirm">
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Control
          required
          value={values.passwordconfirm}
          onChange={handleChange}
          type="password"
          name="passwordconfirm"
        />
      </Form.Group>
      <Button block disabled={!isValid} type="submit">
        Register
      </Button>
    </Form>
  );
};

const RegisterWebAuthn = ({signInWebAuthn}) => {
  // TODO
};
