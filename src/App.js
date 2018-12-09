import React, { Component } from 'react';
import { Redirect } from 'react-router';

import Login from './components/Login';
import logo from './logo.svg';
import EditProfile from './components/EditProfile';

import './App.css';

const LS_KEY = 'frontrow';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY)
    };
  }

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  };

  render() {
    if(!this.state.auth) { 
      return <Redirect to={{pathname: "/login"}} />;
    } else {
      alert(this.state.auth)
    }
    return (
      <div className="App">
      ssdcsdcsd
            <Main auth={this.state.auth} onLoggedOut={this.handleLoggedOut} />
      </div>
    );
  }
}

export default App;