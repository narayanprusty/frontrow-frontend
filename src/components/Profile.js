import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import TagsInput from 'react-tagsinput'
import { Redirect } from 'react-router';
import SweetAlert from "react-bootstrap-sweetalert";
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
      send: "",
      interests: []
    };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  hideAlert(){ 
    this.setState({send: ''})
  }

  componentDidMount() {
    this.setState({age: this.props.user.age})
  }

  edit() {
    this.setState({loading: true})
    fetch('http://localhost:7000/user/update',{
      method : 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': "Bearer " + localStorage.getItem(LS_KEY).replace(/\"/g,"")
        },
        body: JSON.stringify({username: this.state.username,age: this.state.age,
                              location: this.state.location,interests: this.state.interests})
      }).then( response => {
        return response.json();
      })
      .then( json =>
      {
        if(json.success==true) {
          this.setState({send: 'true',loading: false})
        } else {
          this.setState({send: 'false',loading: false,error: json.error.result.error})
        }
      
      }).catch(err => {alert(err);this.setState({loading: false})})
    
  }

  handleChange(interests) {
    this.setState({interests})
  }

  render() {
    return (
      <Container>
      {
          this.state.send=='true'? <SweetAlert title="Success!" onConfirm={this.hideAlert}>Successful
                                  </SweetAlert>
         : <p></p> 
    }
{JSON.stringify(this.state)}
{JSON.stringify(this.props.user.age)}
      <br></br>
      <Card className="col col-login mx-auto row mb-6">
      <Card.Body>
        <Form>
            <Form.Input id='username' name='username' value={this.props.user.username} 
                onChange={(evt) => { this.setState({username: evt.target.value});}}
                label='Username' placeholder='Enter Username' />
            <Form.Input id='age' name='age' label='Age' value={this.state.age} 
                onChange={(evt) => { this.setState({age: evt.target.value});}}
                placeholder='Enter Age' />
            <Form.Input id='location' name='location' label='Location' value={this.props.user.location} 
                onChange={(evt) => { this.setState({location: evt.target.value});}}
                placeholder='Enter Location' />
            <b>Interests</b><br></br>
            <TagsInput value={this.props.user.interests} onChange={this.handleChange} />
            <br></br>
            {
              this.state.loading ? <Button disabled
                color='primary'>Updating..</Button>
            :
            <Button onClick={this.edit}
                color='primary'>Edit Profile</Button> }
        </Form>
        </Card.Body>
      </Card>
      </Container>
    );
  }
}

export default Profile;
