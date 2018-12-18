// @flow

import React, { Component } from "react";
import { Page, GalleryCard, Container, Grid } from "tabler-react";
import jwtDecode from "jwt-decode";
import SiteWrapper from "./SiteWrapper.react";
import Moment from 'react-moment';
import { Redirect } from 'react-router';

const LS_KEY = "frontrow";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      username: "",
      send: "",
      age: "",
      location: "",
      interests: [],
      ok: false,
      videos: []
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.VideoRead = this.VideoRead.bind(this);
  }

  VideoRead() {
    fetch("http://localhost:7000/video/get/", {
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
        this.setState({ videos: json.data });
      });
  }

  componentWillMount() {
    var accesstoken = this.state.auth;
    this.VideoRead();
    if (accesstoken == undefined) return;
    accesstoken = accesstoken.replace(/\"/g, "");
    const {
      payload: { id }
    } = jwtDecode(accesstoken);
    fetch(`http://localhost:7000/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    })
      .then(response => response.json())
      .then(json => {
        let user = Object.assign({}, this.state.user);
        user.publicAddress = json.data.publicAddress;
        user.nonce = json.data.nonce;

        fetch("http://localhost:7000/user/get/" + json.data.publicAddress, {
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
                ? this.setState({ interests: null })
                : this.setState({ interests: json.data[0].interests });
            }
            this.setState({ ok: true });
          });
      })
      .catch(window.alert);
  }

  hideAlert() {
    this.setState({ send: "" });
  }

  render() {
    const Videos = ({ data }) => (
      <Container className="row row-cards">
        {data.map(function(video, i) {
          var p = <Moment fromNow>{video.publishedOn}</Moment>
          var link = "/charts/" + video.uniqueIdentifier
          return (
            <Grid.Col sm={6} lg={4} key={i}>
            <div>
            <GalleryCard key={i}>
              <GalleryCard.Image src={video.imageURL}/>
              <GalleryCard.Footer>
                <GalleryCard.Details
                  avatarURL="https://tabler.github.io/tabler/demo/faces/male/41.jpg"
                  fullName={video.title}
                  dateString={p}
                />
                <GalleryCard.IconGroup>
                  <GalleryCard.IconItem name="eye" label={video.totalViews} />
                  <GalleryCard.IconItem name="heart" label={link} right />
                </GalleryCard.IconGroup>
              </GalleryCard.Footer>
            </GalleryCard>
            </div>
            </Grid.Col>
          );
        })}
      </Container>
    );

    return (
      <SiteWrapper>
        <Page.Content>
                  <Videos data={this.state.videos}  />
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default Home;
