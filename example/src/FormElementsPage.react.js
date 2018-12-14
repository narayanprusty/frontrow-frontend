// @flow

import React,{Component} from "react";
import { Page, Card, Grid, Form, Button, Dropdown } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";
import SweetAlert from "react-bootstrap-sweetalert";

const LS_KEY = "frontrow"

class VideoForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: "",
      thumbnail: "",
      videoURL: "",
      user: "",
      send: "",
      ok: false,
      auth: localStorage.getItem(LS_KEY) || undefined
    };
    this.addVideo = this.addVideo.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  addVideo() {

    this.setState({ loading: true });
    fetch("http://localhost:7000/video/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "authorization":
          "Bearer " + localStorage.getItem(LS_KEY).replace(/\"/g, "")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success == true) {
          this.setState({ send: "true",loading: false });
          alert(JSON.stringify(json.vid));
        } else {
          this.setState({
            send: "false",
            loading: false,
            error: json.error.result.error
          });
        }
      })
      .catch(err => {
        alert(err);
        this.setState({ loading: false });
      });

  }

  hideAlert() {
    this.setState({ send: "" });
  }

  render() {

      return (
        <SiteWrapper>
        {this.state.send == "true" ? (
              <SweetAlert title="Success!" onConfirm={this.hideAlert}>
                Successful
              </SweetAlert>
            ) : (
              <p />
        )}
          <Page.Card
            title="Upload Video"
            footer={
              <Card.Footer>
                <div className="d-flex">
                { this.state.loading ? (
                      <Button disabled
                       className="ml-auto" 
                       color="primary">
                        Uploading..
                      </Button>
                    ) : (
                      <Button 
                        color="primary" 
                        className="ml-auto"
                        onClick={this.addVideo}
                      >
                        Upload Video
                      </Button>
                )}
                </div>
              </Card.Footer>
            }
          >
            
            <Grid.Row>
              <Grid.Col lg={12}>
                <Form>
                    <Grid.Row>
                      <Grid.Col sm={6} md={3}>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Title"
                            onChange={evt => {
                              this.setState({ title: evt.target.value });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={6} md={4}>
                        <Form.Group>
                          <Form.Label>Thumbnail URL</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Thumbnail URL"
                            value={this.state.thumbnail}
                            onChange={evt => {
                              this.setState({ thumbnail: evt.target.value });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col sm={6} md={4}>
                        <Form.Group>
                          <Form.Label>Video URL</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Video URL"
                            value={this.state.video}
                            onChange={evt => {
                              this.setState({ video: evt.target.value });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                      </Grid.Row>
                </Form>
              </Grid.Col>
            </Grid.Row>
            
          </Page.Card>
        </SiteWrapper>
      );
 
    }
}

export default VideoForm;
