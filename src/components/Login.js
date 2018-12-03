import React, { Component } from 'react';
import Web3 from 'web3';

var web3 = null;  
var add = "";
class Login extends Component {

   constructor(props){
    super(props);
    this.state = {
      loading: false,
    };

    this.Login = this.Login.bind(this);
    this.Init = this.Init.bind(this);
  }

  componentDidMount() {
    this.Init();
  }

  Init = async () => {
    window.web3 = new Web3(window.ethereum);
    add = await window.ethereum.enable();
  }
  
    Login = async () => {

    const { onLoggedIn } = this.props;
   
    
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
        data => (
        data.users.length!=0 ?   console.log(data.users.nonce)
         :  this.handleSignup(publicAddress)
        .then(function(data){
            return data.nonce
        }) )
      )
       .then(nonce =>this.handleSignMessage(publicAddress,nonce))
       .then(sig => this.handleAuthenticate(publicAddress,sig))
       .then(token => this.handleLoggedIn(token))
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });

  }

  handleLoggedIn = auth => {
    alert("auth: " + auth)
    //localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth: auth  });
  };

  handleSignup = publicAddress =>
    fetch(`http://localhost:7000/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  handleSignMessage = ( publicAddress, nonce ) => {
    return new Promise((resolve, reject) =>
        web3.eth.personal.sign(
            web3.utils.fromUtf8(`I am signing my one-time nonce: ` + nonce),
            publicAddress,
            (err, signature) => {
            if (err) {
                return reject(err);
                }
            return resolve( signature );
            }
      )
    );
  };

  handleAuthenticate = (publicAddress, signature ) => {
    fetch(`http://localhost:7000/auth`, {
      body: JSON.stringify({ publicAddress: publicAddress, signature: signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json()).then(data => {return data.token} );
  }
    

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
