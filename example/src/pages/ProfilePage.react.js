// @flow

import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import {
  Container,
  Grid,
  Card,
  Button,
  Form,
  Avatar,
  Profile,
  List,
  Media,
  Text,
  Comment
} from "tabler-react";
import SweetAlert from "react-bootstrap-sweetalert";
import TagsInput from "react-tagsinput";
import SiteWrapper from "../SiteWrapper.react";
import "react-tagsinput/react-tagsinput.css";
import config from "./../config/config";
import Countries from "../helpers/countries";

const LS_KEY = "frontrow";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: "",
      age: "",
      location: "",
      send: "",
      interests: [],
      ok: true,
      earnings: "",
      videoEarnings: "",
      adsSeen: "",
      adsPopped: "",
      auth: localStorage.getItem(LS_KEY) || undefined
    };
    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  hideAlert() {
    this.setState({ send: "" });
    this.props.history.push(`/`);
  }

  edit() {
    this.setState({ loading: true });
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    fetch(config.api.serverUrl + "/user/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer " + auth
      },
      body: JSON.stringify({
        username: this.state.username,
        age: this.state.age,
        location: this.state.location,
        interests: this.state.interests
      })
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success == true) {
          this.setState({ send: "true", loading: false });
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

  handleChange(interests) {
    this.setState({ interests });
  }

  componentDidMount() {
    if (!this.state.auth) {
      window.location = "/";
    }
  }

  componentWillMount() {
    var accesstoken = this.state.auth;
    if (accesstoken == undefined) return;
    accesstoken = accesstoken.replace(/\"/g, "");
    const {
      payload: { id }
    } = jwtDecode(accesstoken);
    fetch(`${config.api.serverUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    })
      .then(response => response.json())
      .then(json => {
        let user = Object.assign({}, this.state.user);
        user.publicAddress = json.data.publicAddress;
        user.nonce = json.data.nonce;

        fetch(config.api.serverUrl + "/user/get/" + json.data.publicAddress, {
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
            console.log("User data", json.data[0]);
            if (json.data[0] == undefined) return;
            {
              json.data[0].username == undefined
                ? this.setState({ username: null })
                : this.setState({ username: json.data[0].username });
            }
            {
              json.data[0].age == undefined
                ? this.setState({ age: null })
                : this.setState({ age: json.data[0].age });
            }
            {
              json.data[0].location == undefined
                ? this.setState({ location: null })
                : this.setState({ location: json.data[0].location });
            }
            {
              json.data[0].interests == undefined
                ? this.setState({ interests: [] })
                : this.setState({ interests: json.data[0].interests });
            }
            {
              json.data[0].earning == undefined
                ? this.setState({ earnings: "" })
                : this.setState({ earnings: json.data[0].earning });
            }
            {
                json.data[0].videoEarnings == undefined
                ? this.setState({videoEarnings: 0})
                : this.setState({videoEarnings: json.data[0].videoEarnings});
            }
            {
                json.data[0].adsPopped == undefined
                ? this.setState({adsPopped: 0})
                : this.setState({adsPopped: json.data[0].adsPopped});
            }
            {
                json.data[0].adsSeen == undefined
                ? this.setState({adsSeen: 0})
                : this.setState({adsSeen: json.data[0].adsSeen});
            }
            this.setState({ ok: true });
          });
      })
      .catch(window.alert);
  }

  render() {
    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            {this.state.send == "true" ? (
              <SweetAlert title="Success!" onConfirm={this.hideAlert}>
                Profile Updated
              </SweetAlert>
            ) : (
              <p />
            )}
            <Grid.Row>
              <Grid.Col>
                <Form className="card">
                  <Card.Body>
                    <Card.Title>Edit Profile</Card.Title>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>Username</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={evt => {
                              this.setState({ username: evt.target.value });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>Age</Form.Label>
                          <Form.Input
                            type="text"
                            placeholder="Age"
                            value={this.state.age}
                            onChange={evt => {
                              this.setState({ age: evt.target.value });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>
                            Country : {this.state.location}
                          </Form.Label>
                          <Select
                            options={Countries}
                            onChange={evt => {
                              this.setState({ location: evt.label });
                            }}
                          />
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>Interests</Form.Label>
                          <TagsInput
                            value={this.state.interests}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} md={12}>
                        <div>
                          Your earnings (Ads):{" $"}
                          {this.state.earnings
                            ? Math.round(this.state.earnings * 1000) / 1000
                            : 0}
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} md={12}>
                        <div>
                          Your earnings (Uploads):{" $"}
                          {this.state.videoEarnings
                            ? Math.round(this.state.videoEarnings * 1000) / 1000
                            : 0}
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} md={12}>
                        <div>
                          Total ads seen:{" "}
                          {this.state.adsSeen
                            ? Math.round(this.state.adsSeen * 1000) / 1000
                            : 0}
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col xs={12} sm={12} md={12}>
                        <div>
                          Total ads popped in your videos:{" "}
                          {this.state.adsPopped
                            ? Math.round(this.state.adsPopped * 1000) / 1000
                            : 0}
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                  <Card.Footer className="text-right">
                    {this.state.ok == false ? (
                      <Button disabled color="primary">
                        Update Profile
                      </Button>
                    ) : this.state.loading ? (
                      <Button disabled color="primary">
                        Updating..
                      </Button>
                    ) : (
                      <Button onClick={this.edit} color="primary">
                        Update Profile
                      </Button>
                    )}
                  </Card.Footer>
                </Form>
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
      </SiteWrapper>
    );
  }
}

export default ProfilePage;
