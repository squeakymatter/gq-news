import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {} from 'react-bootstrap';
import { Container } from 'react-bootstrap';

import Home from './components/Home';
import Header from './components/Header';
import UserAccess from './components/User/UserAccess';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Container className='mt-4'>
          <Switch>
            <Route path='/sign_in' component={UserAccess}></Route>
            <Route path='/' component={Home} />
          </Switch>
        </Container>
      </BrowserRouter>
    );
  }
}

export default Routes;
