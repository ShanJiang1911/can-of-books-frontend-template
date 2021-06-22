// import './App.css'
import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Header from './Header'
import Footer from './Footer'
import IsLoadingAndError from './IsLoadingAndError'
import BestBooks from './BestBooks'
import axios from 'axios'


class App extends React.Component {

  makeRequest = async() =>{
    const {getIdTokenClaims} = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;
  
    const config = {
      headers: {"Authorization": `Bearer ${jwt}` }
    };
    const serverResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/test-login`, config);
  
    console.log(serverResponse);
  }

  render() {
    // displays if information about user is returned from auth0
    console.log(this.props.auth0);

    // declaring vars from the object data recieved from auth0
    const { user, isAuthenticated, isLoading } = this.props.auth0;

    // sets conidition if data from auth0 is loading, display 'Loading'
    if (isLoading) {
      return <h2>Loading</h2>
    } else {
      // when done loading display page and log in, with condition set if logged in do not show log out button
      return (
        <React.Fragment>

          <Router>
            <IsLoadingAndError>
              <Header />
              <Switch>
                <Route exact path="/">
                  {isAuthenticated ? <BestBooks /> : ''}
                </Route>
                {isAuthenticated ? <Profile name={user.name} email={user.email} picture={user.picture} /> : ''}
              </Switch>
              <button onClick={this.makeRequest}>Request to Server</button>
              <Footer />
            </IsLoadingAndError>
          </Router>

        </React.Fragment>
      );
    }
  }
}

export default withAuth0(App);
