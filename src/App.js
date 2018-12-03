import React, { Component } from 'react';

import Login from './components/Login';
import logo from './logo.svg';
import Profile from './components/Profile';
import './App.css';

const LS_KEY = 'frontrow_auth';

class App extends Component {
  componentWillMount() {
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({
      auth: undefined
    });
  }

  // handleLoggedIn = auth => {
  //   alert("auth: " + auth)
  //   //localStorage.setItem(LS_KEY, JSON.stringify(auth));
  //   this.setState({ auth: auth  });
  // };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  };

  render() {
    const { auth } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Login with MetaMask Demo</h1>
        </header>
        <div className="App-intro">
          {auth ? (
            <Profile auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <Login />
          )}
        </div>
      </div>
    );
  }
}

export default App;