// @flow

import React,{Component} from "react";
import { Page, Grid, Card} from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from 'react-player';
import Moment from 'react-moment';

const LS_KEY = "frontrow";

class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vid: JSON.stringify(this.props.location.pathname.split('/')[2]),
      loading: false,
      title: "",
      videoURL: "",
      views: "",
      user: "",
      send: "",
      ok: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      views: "",
      publishDate: ""        
    };
    this.OneVideoRead = this.OneVideoRead.bind(this);
  }

  componentDidMount() {
    this.OneVideoRead()
  }

  OneVideoRead() {
    var vid = this.state.vid;
    fetch("http://localhost:7000/video/get/"+vid.replace(/\"/g, ""), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("jwt")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        
        if(json.success == true){
          this.setState({ title: json.data[0].title , views: json.data[0].totalViews , 
            publishDate: json.data[0].publishedOn,videoURL: json.data[0].video });
        } else {
          alert("Sdc")
        }
        
      });
  }

  render() {

    return (
      <SiteWrapper>
        <Page.Content>
          <Grid.Row>
          <Card>
              <Card.Header>
                <Card.Title>{this.state.title}</Card.Title>
              </Card.Header>
            <Card.Body>

            <Grid.Col sm={6} lg={4}>
              <ReactPlayer
                url={this.state.videoURL}
                className='react-player'
                controls='true'
              />
                
              <b>Total Views :</b> {this.state.views} <br></br>
              <b>Published Date :</b> <Moment>{this.state.publishDate}</Moment>
            
            </Grid.Col>

            </Card.Body>
          </Card>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );

  }
 
}

export default Video;
