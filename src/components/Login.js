import React, { Component } from 'react';
import Web3 from 'web3';
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Card } from "tabler-react";

var web3 = null;  
var add = "";
var LS_KEY = "frontrow"
class Login extends Component {

   constructor(props){
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      //address: undefined
    };

    this.Login = this.Login.bind(this);
    this.Init = this.Init.bind(this);
  }

  componentDidMount() {
    //this.Init();
  }

  Init = async () => {
    window.web3 = new Web3(window.ethereum);
    add = await window.ethereum.enable();
    await this.setState({address: add[0]})
  }
  
    Login = async () => {   

    await this.Init();
    
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    this.setState({ loading: true });
    
    try {
      var nonce = ""
      var response = await fetch(`http://localhost:7000/users?publicAddress=${add[0]}`)
      var data = await response.json()
      if(data.users.length!==0) {
        nonce = await data.users[0].nonce;
      } else {
        nonce = await this.handleSignup(add[0])
        nonce = await nonce.nonce
      }
      
      var sig = await this.handleSignMessage(add[0],nonce);
      var token = await this.handleAuthenticate(add[0],sig)
      var auth = await token.token
      var login = await this.handleLoggedIn(auth)
      await this.setState({loading: false})

    } catch(e) {
        window.alert(e);
        this.setState({ loading: false });
    }
    
  }

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
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

    return fetch(`http://localhost:7000/auth`, {
      body: JSON.stringify({ publicAddress: publicAddress, signature: signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => { return response.json(); });

  }
    

  render() {
   
    if (this.state.auth) {
      return <Redirect to={{pathname: "/home", state:{id: this.state.auth}} } />;
    }
    
  return (
      <Container className="text-center col col-login">
      <Card>
        <Card.Header >
          <Card.Title className="text-center">FrontRow</Card.Title>
         </Card.Header>
        <Card.Body >
            <Button onClick={this.Login} color="primary" >
            {this.state.loading ? 'Loading...' : 'Login with MetaMask'}
          </Button>
        </Card.Body>
      </Card>

      </Container> 
   );
  }
}

export default Login;
