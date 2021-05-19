import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Toast } from 'react-bootstrap';
import axios from 'axios';
import ToastHandler from '../../utils/toasts';
//form validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import { signupUser, loginUser } from '../../../store/actions';

const UserAccess = (props) => {
  const dispatch = useDispatch();
  //switch between Sign In and Register
  const [type, setType] = useState(true);
  //add validation using formik hook
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at minimum of 6 characters.')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      onSubmitHandler(values);
    },
  });
  // change between login and register CTAs depending on current location
  const switchTypeHandler = () => {
    setType(!type);
  };

  const onSubmitHandler = (values) => {
    if (type) {
      dispatch(loginUser(values)).then(({ payload }) => {
        successHandler(payload);
      });
    } else {
      // register
      dispatch(signupUser(values)).then(({ payload }) => {
        successHandler(payload);
      });
    }
  };

  const successHandler = (payload) => {
    const errors = payload.errors;
    const auth = payload.auth;

    if (errors) {
      ToastHandler(errors, 'ERROR');
    }
    if (auth) {
      //set token with value we get from server
      localStorage.setItem('X-AUTH', auth.token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token;
      //trigger toast
      ToastHandler('Welcome', 'SUCCESS');
      //redirect user to user's page.
      props.history.push('/user_area');
    }
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Row className='mb-4'>
          <Col>
            <h1>Sign In / Register</h1>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your email'
            id='email'
            name='email'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <Alert variant='danger'>{formik.errors.email}</Alert>
          ) : null}
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter your password'
            id='password'
            name='password'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <Alert variant='danger'>{formik.errors.password}</Alert>
          ) : null}
        </Form.Group>
        {type ? (
          <Button variant='primary' type='submit'>
            Log In
          </Button>
        ) : (
          <Button variant='primary' type='submit'>
            Register
          </Button>
        )}
        <Button
          variant='secondary'
          className='ml-2'
          onClick={switchTypeHandler}
        >
          {type
            ? 'Sign up for an account'
            : 'Already registered? Click here to Login.'}
        </Button>
      </Form>
    </>
  );
};

export default UserAccess;
