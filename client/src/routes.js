import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {} from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AutoSignIn from './components/Hoc/AutoSignIn';
import Home from './components/Home';
import Header from './components/Header';
import UserAccess from './components/User/UserAccess';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <AutoSignIn>
          <ToastContainer />
          <Header />
          <Container className='mt-4'>
            <Switch>
              <Route path='/sign_in' component={UserAccess}></Route>
              <Route path='/' component={Home} />
            </Switch>
          </Container>
        </AutoSignIn>
      </BrowserRouter>
    );
  }
}

export default Routes;
