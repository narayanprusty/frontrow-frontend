import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import TagsInput from 'react-tagsinput'
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Form,Card } from "tabler-react";
import 'react-tagsinput/react-tagsinput.css'
const LS_KEY = 'frontrow';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      username: "",
      age: "",
      location: "",
      interests: this.props.user.interests
    };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  edit() {
    alert(this.state.interests)      
  }

  handleChange(interests) {
    this.setState({interests})
  }

  render() {
    return (
      <Container>
      <br></br>
      <Card className="col col-login mx-auto row mb-6">
      <Card.Body>
        <Form>
            <Form.Input id='username' name='username' value={this.props.user.username} 
                onChange={(evt) => { this.setState({username: evt.target.value});}}
                label='Username' placeholder='Enter Username' />
            <Form.Input id='age' name='age' label='Age' value={this.props.user.age} 
                placeholder='Enter Age' />
            <Form.Input id='location' name='location' label='Location' value={this.props.user.location} 
                placeholder='Enter Location' />
            <b>Interests</b><br></br>
            <TagsInput value={this.state.interests} onChange={this.handleChange} />
            <br></br>
            <Button onClick={this.edit}
                color='primary'>Submit</Button>
        </Form>
        </Card.Body>
      </Card>
      </Container>
    );
  }
}

export default Profile;
