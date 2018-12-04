import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Form } from "tabler-react";

const LS_KEY = 'frontrow';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      username: "",
      age: "",
      location: "",
      interests: []
    };
    this.edit = this.edit.bind(this);
  }

  edit() {
    alert(this.state.username)      
  }

  render() {
    return (
      <Container>
        <Form>
            <Form.Input id='username' name='username' value={this.props.user.username} 
                onChange={(evt) => { this.setState({username: evt.target.value});}}
                label='Username' placeholder='Enter Username' />
            <Form.Input id='age' name='age' label='Age' value={this.props.user.age} 
                placeholder='Enter Age' />
            <Form.Input id='location' name='location' label='Location' value={this.props.user.location} 
                placeholder='Enter Location' />
            <Form.Input id='interests' name='interests' label='Interests' value={this.props.user.interests} 
                placeholder='Enter your Interests' />
            <Button onClick={this.edit}
                color='primary'>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default Profile;
