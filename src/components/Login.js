import React, { Component } from 'react';
import Web3 from 'web3';

var web3 = null;  
class Login extends Component {

   constructor(props){
    super(props);
    this.state = {
      loading: false,
    };

    this.Login = this.Login.bind(this);

  }
  
    Login = async () => {

    const { onLoggedIn } = this.props;

    window.web3 = new Web3(window.ethereum);
    var add = await window.ethereum.enable();
    
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    var publicAddress = add[0];

    this.setState({ loading: true });

    fetch(`http://localhost:7000/users?publicAddress=${publicAddress}`)
      .then(response => response.json())
      .then(
        data => (data.users.length!=0 ? alert("User present") :  this.handleSignup(publicAddress)
        .then(function(data){
            return data.nonce
        }) )
      )
       .then(nonce =>this.handleSignMessage(publicAddress,nonce))
       .then(data => alert("Final: " + data))
    //   .then(this.handleAuthenticate)
    //   .then(onLoggedIn)
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

  handleSignMessage = ( publicAddress, nonce ) => {
      alert("Data: " + nonce + " " + publicAddress)
    return new Promise((resolve, reject) =>
        web3.eth.personal.sign(
            web3.utils.fromUtf8(`I am signing my one-time nonce: ` + nonce),
            publicAddress,
            (err, signature) => {
            if (err) {
                return reject(err);
                }
            return resolve( publicAddress, signature );
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
