// @flow

import React,{Component} from "react";
import { Page, Grid, Card} from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from 'react-player';

const LS_KEY = "frontrow";

class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: "",
      videoURL: "",
      user: "",
      send: "",
      ok: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      views: ""        
    };
  }

  render() {

    return (
      <SiteWrapper>
        <Page.Content>
          <Grid.Row>
          <Card>
              <Card.Header>
                <Card.Title>"Title"</Card.Title>
              </Card.Header>
            <Card.Body>
            <ReactPlayer
              url='https://www.youtube.com/watch?v=rnwlWn603g4'
              className='react-player'
              controls='true'
            />
            </Card.Body>
          </Card>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );

  }
 
}

export default Video;
