// import './App.css'
import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { withAuth0 } from '@auth0/auth0-react';


class App extends React.Component {

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
          <h1>Login is fun</h1>
          {
            isAuthenticated ?
            <LogoutButton />:
              <LoginButton />
          }
          {user ? <h3>{user.name} is signed in</h3> : ''}
        </React.Fragment>
      );
    }
  }
}

export default withAuth0(App);
