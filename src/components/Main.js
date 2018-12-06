import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Nav } from "tabler-react";
import Profile from "./Profile";

const LS_KEY = 'frontrow';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY),
      user: {
        publicAddress: "",
        nonce: "",
        username: "",
        location: "",
        interests: [],
        age: ""
      }
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
      .then(json =>  {
        let user = Object.assign({},this.state.user);
        user.publicAddress = json.data.publicAddress;
        user.nonce = json.data.nonce;
        user.username = json.data.username||undefined;
        user.age = json.data.age||null;
        user.location = json.data.location||null;
        user.interests = json.data.interests||null;
        this.setState({user})
      })
      .catch(window.alert);
  }

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: null });
  };

  render() {
    
    var publicAddress = "";
    
    if(!this.state.auth || this.state.auth==null) { 
      return <Redirect to={{pathname: "/"}} />;
    } else {
     publicAddress = jwtDecode(this.state.auth).payload.publicAddress
    }
    
    return (
      <Container>

        <Nav className="header">
          <Nav.Item value="FrontRow" icon="globe"></Nav.Item>
          <Nav.Item active value="My Profile" icon="user"></Nav.Item>
          <Nav.Item className="d-flex order-lg-2 ml-auto"><Button color="primary"  
          onClick={this.handleLoggedOut}>Logout</Button></Nav.Item>
        </Nav>

        <Profile {...this.state}/>

          <br></br>        
      
      </Container>
    );
  }
}


export default Main;
