import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Nav,Site,Form,Card } from "tabler-react";
import SweetAlert from "react-bootstrap-sweetalert";
import TagsInput from 'react-tagsinput'
import Profile from "./Profile";

const LS_KEY = 'frontrow';

class EditProfile extends Component {
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
        age: "",
        videoRedirect: false
      },
      username: "",
      age: "",
      location: "",
      send: "",
      interests: [],
      ok: false,
      gotoEdit: false
    };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.RedirectVid = this.RedirectVid.bind(this);
    this.RedirectEdit = this.RedirectEdit.bind(this);
  }

  RedirectVid() {
    this.setState({video: true})
  }

  hideAlert(){ 
    this.setState({send: ''})
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
        
        fetch('http://localhost:7000/user/get/'+json.data.publicAddress,{
          method : 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              //'authorization': localStorage.getItem('jwt')
            },
          }).then( response => {
            return response.json();
          })
          .then( json =>
          {
            {
              json.data[0].username==undefined ? user.username = null :user.username = json.data[0].username;
            }
            {
              json.data[0].age==undefined ? user.age =null :user.age = json.data[0].age;
            }
            {
              json.data[0].location==undefined ? user.location =null :user.location = json.data[0].location;
            }
            {
              json.data[0].interests==undefined ? user.interests =null :user.interests = json.data[0].interests;
            }
            this.setState({user})
            this.setState({username: user.username})
            this.setState({age: user.age})
            this.setState({location: user.location})
            this.setState({interests: user.interests})
            this.setState({ok: true})
          })
      })
      .catch(window.alert);
  }

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: null });
  };

  RedirectEdit() {
    this.setState({gotoEdit: true})
  }

  render() {
    
    var publicAddress = "";
    
    if(!this.state.auth || this.state.auth==null) { 
      return <Redirect to={{pathname: "/"}} />;
    } else {
     publicAddress = jwtDecode(this.state.auth).payload.publicAddress
    }

    if(this.state.video == true) {
      return <Redirect to={{pathname: "/videos"}} />;
    }
    
    return (
      <Container>
      <Site.Header className="d-flex container header py-4">
          <a className="header-brand">Frontrow</a>
          <div className="d-flex order-lg-2 ml-auto">
          <Button onClick={this.RedirectEdit} className="d-none nav-item d-md-flex" color='primary'>Edit Profile</Button>
          &nbsp;
          <Button className="d-none d-md-flex" color="primary"  
          onClick={this.handleLoggedOut}>Logout</Button>
          </div>
      </Site.Header>
      <Nav className="d-flex container header py-12">
          <Nav.Item value="FrontRow" icon="globe"></Nav.Item>
          <Nav.Item onClick={this.RedirectVid}  value="Videos" icon="user"></Nav.Item>
          <Nav.Item  value="Adverisement" icon="globe"></Nav.Item>
      </Nav>

        <Container>
      {
          this.state.send=='true'? <SweetAlert title="Success!" onConfirm={this.hideAlert}>Successful
                                  </SweetAlert>
         : <p></p> 
    }
      <br></br>
      <Card className="col col-login mx-auto row mb-6">
      <Card.Body>
        <Form>
            <Form.Input id='username' name='username' value={this.state.username} 
                onChange={(evt) => { this.setState({username: evt.target.value});}}
                label='Username' placeholder='Enter Username' />
            <Form.Input id='age' name='age' label='Age' value={this.state.age} 
                onChange={(evt) => { this.setState({age: evt.target.value});}}
                placeholder='Enter Age' />
            <Form.Input id='location' name='location' label='Location' value={this.state.location} 
                onChange={(evt) => { this.setState({location: evt.target.value});}}
                placeholder='Enter Location' />
            <b>Interests</b><br></br>
            <TagsInput value={this.state.interests} onChange={this.handleChange} />
            <br></br>
            {
              this.state.ok == false ? <Button disabled
                color='primary'>Edit Profile</Button> :
              this.state.loading ? <Button disabled
                color='primary'>Updating..</Button>
            :
            <Button onClick={this.edit}
                color='primary'>Edit Profile</Button> }
        </Form>
        </Card.Body>
      </Card>
      </Container>

          <br></br>        
      
      </Container>
    );
  }
}


export default EditProfile;
