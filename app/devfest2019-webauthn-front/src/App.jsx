import React, {Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Link} from "react-router-dom";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Routes} from "./Routes";
import {AuthProvider, useAuth} from "./services/Auth.result";


const AppInternal = () => {
  const {
    isAuthenticated,
    logOut,
    user,
  } = useAuth();
  return (
    <div className="App container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand><Link to="/" className="mr-auto nav-brand-link">Home</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            {isAuthenticated
              ?
              <NavDropdown title={user.username}>
                <NavDropdown.Item  onClick={logOut}>Logout</NavDropdown.Item>
              </NavDropdown>
              : <Fragment>
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes/>
    </div>
  );
};

export const App = () => (<Router><AuthProvider><AppInternal/></AuthProvider></Router>);
