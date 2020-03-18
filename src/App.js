import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './Firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    isValid: false
  })

  const handleSignIn = () => {

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)


      })
      .catch(error => {
        console.log(error)
        console.log(error.message)
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then((res) => {

        const signedOut = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          existingUser: false
        }

        setUser(signedOut)


      }).catch(function (error) {
        // An error happened.
      });
  }

  const switchForm = (e) => {
    const createdUser = { ...user };

    createdUser.existingUser = e.target.checked;
    setUser(createdUser)

  }

  const emailChecker = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i
  const checkEmail = (input) => emailChecker.test(input);

  const passwordChecker = /^[a-zA-Z]\w{3,14}$/;
  const checkPassword = (input) => passwordChecker.test(input)




  const handleChange = (e) => {

    let isValid = true;

    const newUserInfo = { ...user };

    if (e.target.name === 'email') {
      isValid = checkEmail(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8 && checkPassword(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo)



  }

  const createAccount = (e) => {

    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)
        })
        .catch(error => {
          console.log(error)
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = error.message
          setUser(createdUser)
        })
    }

    e.preventDefault();
    e.target.reset();
    console.log(user)
  }

  const signInUser = (e) => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {

          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)
        })
        .catch(error => {

          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = error.message
          setUser(createdUser)
        })
    }
    e.preventDefault();
    e.target.reset();
  }

  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn &&
        <div>
          <h1>Welcome {user.name}</h1>
          <p>your Email id: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <br />
      <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm} />
      <label htmlFor="switchForm">Returning User</label>
      <form style={{ display: user.existingUser ? 'block' : 'none' }} onSubmit={signInUser}>

        <input onBlur={handleChange} type="email" name="email" placeholder="Enter Your Email" required />
        <br />
        <input onBlur={handleChange} type="password" name="password" placeholder="Enter Your Password" required />
        <br />
        <input type="submit" value="Sign In" />

      </form>
      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
        <h3>New Account Form</h3>
        <input onBlur={handleChange} type="text" name="name" placeholder="Enter Your name" required />
        <br />
        <input onBlur={handleChange} type="email" name="email" placeholder="Enter Your Email" required />
        <br />
        <input onBlur={handleChange} type="password" name="password" placeholder="Enter Your Password" required />
        <br />
        <input type="submit" value="create Account" />

      </form>
      {user.error && <p style={{ color: 'red' }}>{user.error}</p>}
    </div>
  );
}

export default App;
