import React, { Component } from 'react';
import Web3 from 'web3';

let web3 = null;  
class Login extends Component {

   constructor(props){
    super(props);
    this.state = {
      loading: false
    };

    this.Login = this.Login.bind(this);

  }
  
  async Login() {

    const { onLoggedIn } = this.props;

    window.web3 = new Web3(window.ethereum);
    var add = await window.ethereum.enable();

    window.web3 = new Web3(web3.eth.currentProvider);
    
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    var publicAddress = add[0];

    alert(publicAddress)

    this.setState({ loading: true });

    fetch(`http://localhost:7000/users?publicAddress=${publicAddress}`)
      .then(response => response.json())
      .then(
        users => (users.length ? users[0] : this.handleSignup(publicAddress))
      )
      .then(this.handleSignMessage)
      .then(this.handleAuthenticate)
      .then(onLoggedIn)
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });

  }

  handleSignup = publicAddress =>
    fetch(`http://localhost:7000/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  handleSignMessage = ({ publicAddress, nonce }) => {
    return new Promise((resolve, reject) =>
      web3.personal.sign(
        web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`http://localhost:7000/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  render() {
    console.log(this.state);
  
  return (
      <div>
        
        <button onClick={this.Login}>
          {this.state.loading ? 'Loading...' : 'Login with MetaMask'}
        </button>
        
      </div> 
   );
  }
}

export default Login;
