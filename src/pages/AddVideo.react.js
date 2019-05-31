// @flow

import React, { Component } from "react";
import { Page, Card, Grid, Form, Button, Dropdown } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import SweetAlert from "react-bootstrap-sweetalert";
import config from "../config/config";
import categories from "../data/categories.json"
import languages from "../data/languages.json"

const LS_KEY = "frontrow";

class AddVideo extends Component {
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
      auth: localStorage.getItem(LS_KEY) || undefined,
      notLoggedIn: false,
      language: 'hindi',
      category: 'movies_action',
      videoType: 'youtube_video'
    };
    this.addVideo = this.addVideo.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.hideLoginAlert = this.hideLoginAlert.bind(this);
  }

  componentDidMount() {
    if (!this.state.auth) {
        this.setState({notLoggedIn: true});
    }
  }

  hideLoginAlert() {
    this.props.history.push(`/`);
  }

  addVideo() {
    this.setState({ loading: true });
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    fetch(config.api.serverUrl + "/video/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer " + auth
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success == true) {
          this.setState({ loading: true });
          var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
          fetch(config.api.serverUrl + "/video/update", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              authorization:
                "Bearer " + auth
            },
            body: JSON.stringify({
              imageURL: this.state.thumbnail,
              title: this.state.title,
              videoURL: this.state.videoURL,
              id: json.vid,
              language: this.state.language,
              category: this.state.category,
              videoType: this.state.videoType
            })
          })
            .then(response => {
              return response.json();
            })
            .then(json1 => {
              if (json1.success == true) {
                this.setState({ send: "true", loading: false });
              } else {
                  console.log(json1);
                this.setState({
                  send: "false",
                  loading: false,
                  error: json1.message
                });
              }
            })
            .catch(err => {
              alert(err);
              this.setState({ loading: false });
            });
        } else {
          this.setState({
            send: "false",
            loading: false,
            error: json.message
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
    //this.props.history.push(`/`);
  }

  render() {
    return (
      <div>
        {this.state.send == "true" ? (
          <SweetAlert title="Success!" onConfirm={this.hideAlert}>
            Successful
          </SweetAlert>
        ) : (
          <p />
        )}
        {this.state.notLoggedIn ? (
            <SweetAlert title="Not logged in" onConfirm={this.hideLoginAlert}>
                Please login!
            </SweetAlert>
        ) : (
            <p />
        )}
        <Page.Card
          title="Upload Video"
          footer={
            <Card.Footer>
              <div className="d-flex">
                {this.state.loading ? (
                  <Button disabled className="ml-auto" color="primary">
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
            <Grid.Col>
              <Form>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
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
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
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
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
                    <Form.Group>
                      <Form.Label>Video Type</Form.Label>
                      <Form.Select name='videoType' onChange={evt => {
                          this.setState({ videoType: evt.target.value });
                        }}>
                        <option value="youtube_video">
                          Youtube Video
                        </option>
                        <option value="youtube_playlist">
                          Youtube Playlist
                        </option>
                        <option value="file">
                          Live Stream or Video File
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
                    <Form.Group>
                      <Form.Label>Video URL</Form.Label>
                      <Form.Input
                        type="text"
                        placeholder="Video URL"
                        value={this.state.video}
                        onChange={evt => {
                          this.setState({ videoURL: evt.target.value });
                        }}
                      />
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
                    <Form.Group>
                      <Form.Label>Language</Form.Label>
                      <Form.Select name='language' onChange={evt => {
                          this.setState({ language: evt.target.value });
                        }}>
                        {languages.map((item, i) => {
                          return <option value={item.toLowerCase()}>{item}</option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={12}>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Select name='category' onChange={evt => {
                          this.setState({ category: evt.target.value });
                        }}>
                        {categories.map((item, i) => {
                          if(item.child) {
                            return (
                              <optgroup label="Movies">
                                {item.subcategories.map((child) => {
                                  return <option value={child.id}>{child.name}</option>                    
                                })}
                              </optgroup>
                            )
                          } else {
                            return <option value={item.id}>{item.name}</option>
                          }
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
              </Form>
            </Grid.Col>
          </Grid.Row>
        </Page.Card>
      </div>
    );
  }
}

export default AddVideo;
