import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router';

const LS_KEY = 'frontrow';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY),
      user: ""
    };
  }

  componentWillMount() {
    var accesstoken = this.state.auth
    accesstoken = accesstoken.replace(/\"/g,"");
    const { payload: { id } } = jwtDecode(accesstoken);
    fetch(`http://localhost:7000/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    })
      .then(response => response.json())
      .then(user =>  this.setState({ user: JSON.stringify(user.data) }) )
      .catch(window.alert);
  }

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: null });
  };

  render() {
    const { payload: { publicAddress } } = jwtDecode(this.state.auth);
    
    if(!this.state.auth || this.state.auth==null) { 
      return <Redirect to={{pathname: "/login"}} />;
    }
    
    return (
      <div>
        <p>
          Logged in as <Blockies seed={publicAddress} />
        </p>
        {this.state.user}

        <div>
          My publicAddress is <pre>{publicAddress}</pre>
        </div>

        {/* <p>
          <button onClick={this.handleLoggedOut}>Logout</button>
        </p> */}
      
      </div>
    );
  }
}

export default Profile;
