import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';

class Profile extends Component {
  state = {
    loading: false,
    user: null,
    };

  componentWillMount() {
    const { auth: { accessToken } } = this.props;
    const { payload: { id } } = jwtDecode(accessToken);
    fetch(`http://localhost/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ user }))
      .catch(window.alert);
  }

  render() {
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
    
    return (
      <div>
        <p>
          Logged in as <Blockies seed={publicAddress} />
        </p>
        
        <div>
          My publicAddress is <pre>{publicAddress}</pre>
        </div>
        
        <p>
          <button onClick={onLoggedOut}>Logout</button>
        </p>
      
      </div>
    );
  }
}

export default Profile;
