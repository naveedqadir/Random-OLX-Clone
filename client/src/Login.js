import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
}
from 'mdb-react-ui-kit';
import { Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';
import { useToast } from "@chakra-ui/react";
import { getSafeImageUrl } from './utils/imageUtils';


function Login() {
  const [err, setErr] = useState();
  const [justifyActive, setJustifyActive] = useState('tab1');;
  const toast = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const [registered, setRegistered] = useState(false);
  function register(event){
      event.preventDefault();
      var email = document.getElementById("register-email").value;
      var password = document.getElementById("register-password").value;
      var rpassword = document.getElementById("register-rpassword").value;
      var name = document.getElementById("register-name").value;
      if (password === rpassword){
      axios
      .post(`${backendUrl}/register`, {
          email,password,name,
      })
      .then((response) => {
        
        setRegistered(true)
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch((error) => {
        
        setErr(error.response.status)
      });
    }else{
      document.getElementById("register-alert").innerHTML = `Password's Don't Match`;
    }
  }

    function login(event){
        event.preventDefault();
        var email = document.getElementById("login-email").value;
        var password = document.getElementById("login-password").value;
        axios
        .post(`${backendUrl}/login`, {
            email,password
        })
        .then((response) => {
          
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('authemail', response.data.email);
          localStorage.setItem('authname', response.data.name);
          localStorage.setItem('authphone', response.data.phone);
          localStorage.setItem('authpicture', getSafeImageUrl(response.data.picture, 96));
          window.location.href = '/';
        })
        .catch((error) => {
          
          setErr(error.response.status)
        });
    }
  return (
    <MDBContainer className="p-3 mt-1 mb-1 my-5 d-flex flex-column">
      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent >

        <MDBTabsPane show={justifyActive === 'tab1'}>

          <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div key="login-google">
              <GoogleSignIn isVisible={justifyActive === 'tab1'} />
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          <form onSubmit={login}>
          <div className="mb-4">
                <MDBInput label='Your Email' id='login-email' type='email' required/>
              </div>

              <div className="mb-4">
                <MDBInput label='Password' id='login-password' type='password' required/>
              </div>

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='login-flexCheck' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn className="mb-4 w-100" type="submit">Sign in</MDBBtn>
          </form>
          {err === 404 && <Alert variant='danger'> Incorrect Email</Alert>}
          {err === 400 && <Alert variant='danger'> Incorrect Password</Alert>}
          <p className="text-center">Not a member? <button 
            type="button" 
            onClick={() => handleJustifyClick('tab2')}
            style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Register
          </button></p>

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

                    <div className="text-center mb-3">
            <p>Sign up with:</p>

            <div key="register-google">
              <GoogleSignIn isVisible={justifyActive === 'tab2'} />
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          {registered === false &&
          <form onSubmit={register}>
          <MDBInput wrapperClass='mb-4' label='Name' id='register-name' type='text' required/>
          <MDBInput wrapperClass='mb-4' label='Email' id='register-email' type='email' required/>
          <MDBInput wrapperClass='mb-4' label='Password' id='register-password' type='password' required/>
          <MDBInput wrapperClass='mb-4' label='Repeat your password' id='register-rpassword' type='password' required/>

          <Badge id="register-alert" className="mb-1" bg="danger"></Badge>

          <div className='d-flex justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='register-flexCheck' label='I have read and agree to the terms' required/>
          </div>
          {err === 409 && <Alert variant='danger'>User Already Exist,Please Login</Alert>}
          <MDBBtn className="mb-4 w-100" type='submit '>Sign up</MDBBtn>
          </form>
}
          {registered === true && <Alert variant='success'> Registered successfully</Alert>}

        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  );
}

export default Login;
