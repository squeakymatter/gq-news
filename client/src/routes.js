import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {} from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AutoSignIn from './components/Hoc/AutoSignIn';
import Auth from './components/Hoc/Auth';
import Home from './components/Home';
import Header from './components/Header';
import UserAccess from './components/User/UserAccess';
import User from './components/User/';
import Profile from './components/User/UserProfile';
import AdminArticles from './components/User/UserArticles';
import CreateArticle from './components/User/UserArticles/create';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <AutoSignIn>
          <ToastContainer />
          <Header />
          <Container className='mt-4'>
            <Switch>
              <Route
                path='/user_area/profile'
                component={Auth(Profile)}
              ></Route>
              <Route
                path='/user_area/create'
                component={Auth(CreateArticle)}
              ></Route>
              <Route
                path='/user_area/articles'
                component={Auth(AdminArticles)}
              ></Route>
              <Route path='/user_area' component={User}></Route>
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
