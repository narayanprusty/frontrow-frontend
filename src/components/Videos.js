import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router';
import "tabler-react/dist/Tabler.css";
import { Button,Container,Nav,Site,GalleryCard,Card } from "tabler-react";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from 'react-moment';

const LS_KEY = 'frontrow';

class Video extends Component {
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
      },
      username: "",
      age: "",
      location: "",
      send: "",
      interests: [],
      ok: false,
      gotoEdit: false,
      videos: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.RedirectEdit = this.RedirectEdit.bind(this);
    this.VideoRead = this.VideoRead.bind(this);
  }

  hideAlert(){ 
    this.setState({send: ''})
  }

  handleChange(interests) {
    this.setState({interests})
  }

  componentWillMount() {
    this.VideoRead();
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
              json.data[0].username==undefined ? user.username==undefined :user.username = json.data[0].username;
            }
            user.age = json.data[0].age||null;
            user.location = json.data[0].location||null;
            user.interests = json.data[0].interests||null;
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

  VideoRead() {

    fetch('http://localhost:7000/video/get/',{
          method : 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization': localStorage.getItem('jwt')
            },
          }).then( response => {
            return response.json();
          })
          .then( json =>
          {
            this.setState({videos: json.data})
          })
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
    const Videos = ({data}) => (
        <Container className="row row-cards">
        {
            data.map(function(video,i){
                var p = <Moment fromNow>{video.publishedOn}</Moment>
                return <GalleryCard className="rounded col-sm-6 col-lg-4" key={i}>
                <GalleryCard.Image src={video.imageURL} />
                <GalleryCard.Footer>
                    <GalleryCard.Details
                        avatarURL="https://tabler.github.io/tabler/demo/faces/male/41.jpg"
                        fullName={video.title}
                        dateString={p}
                    />
                    <GalleryCard.IconGroup>
                        <GalleryCard.IconItem name="eye" label={video.totalViews} />
                        <GalleryCard.IconItem
                            name="heart"
                            label="0"
                            right
                        />
                    </GalleryCard.IconGroup>
                </GalleryCard.Footer>
            </GalleryCard>
            })
        }
        </Container>
    )
    
    if(!this.state.auth || this.state.auth==null) { 
      return <Redirect to={{pathname: "/"}} />;
    } else {
     publicAddress = jwtDecode(this.state.auth).payload.publicAddress
    }
    if(this.state.gotoEdit == true) {
        return <Redirect to={{pathname: "/edit"}} />;
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
          <Nav.Item active  value="Videos" icon="user"></Nav.Item>
          <Nav.Item  value="Adverisement" icon="globe"></Nav.Item>
      </Nav>

            <Videos data={this.state.videos} />            
            

          <br></br>        
      
      </Container>
    );
  }
}


export default Video;
