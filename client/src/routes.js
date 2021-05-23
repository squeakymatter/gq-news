import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import AutoSignIn from './components/hoc/autoSignin';
import Auth from './components/hoc/auth';

import Home from './components/home';
import Header from './components/header';
import UserAccess from './components/userArea/access';
import UserArea from './components/userArea';
import Profile from './components/userArea/profile';
import AdminRecipe from './components/userArea/recipes';
import Create from './components/userArea/recipes/create';
import Recipe from './components/article';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <AutoSignIn>
          <ToastContainer />
          <Header />
          <Container className='mt-4'>
            <Switch>
              <Route path='/user_area/profile' component={Auth(Profile)} />
              <Route path='/user_area/create' component={Auth(Create)} />
              <Route path='/user_area/recipes' component={Auth(AdminRecipe)} />
              <Route path='/user_area' component={Auth(UserArea)} />
              <Route path='/sign_in' component={UserAccess} />
              <Route path='/article/:id' component={Recipe} />
              <Route path='/' component={Home} />
            </Switch>
          </Container>
        </AutoSignIn>
      </BrowserRouter>
    );
  }
}

export default Routes;
