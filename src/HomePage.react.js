// @flow

import React, { Component } from "react";
import { Page, GalleryCard, Container, Grid } from "tabler-react";
import jwtDecode from "jwt-decode";
import SiteWrapper from "./SiteWrapper.react";
import Moment from "react-moment";
import { Redirect } from "react-router";
import Loader from "react-loader-spinner";
import config from "./config/config";

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
      videos: [],
      loadedVideos: false
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.VideoRead = this.VideoRead.bind(this);
  }

  VideoRead() {
    this.setState({ loadedVideos: false });
    fetch(config.api.serverUrl + "/video/get/", {
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
        this.setState({
          videos: json.data,
          loadedVideos: true
        });
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
    //<GalleryCard.IconItem name="heart" label={} right />
    const Videos = ({ data }) => (
      <Container className="row row-cards">
        {data.map(function(video, i) {
          var p = <Moment fromNow>{video.publishedOn}</Moment>;
          var link = "/video/" + video.uniqueIdentifier;
          return (
            <Grid.Col sm={6} lg={4} key={i}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => window.goToVideo(link)}
              >
                <GalleryCard key={i}>
                  <GalleryCard.Image src={video.imageURL} />
                  <GalleryCard.Footer>
                    <GalleryCard.Details
                      avatarURL="https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png"
                      fullName={
                        video.title +
                        (video.username
                          ? " uploaded by " + video.username.toString()
                          : "")
                      }
                      dateString={p}
                    />
                    <GalleryCard.IconGroup>
                      <GalleryCard.IconItem
                        name="eye"
                        label={video.totalViews}
                      />
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
          {this.state.loadedVideos ? (
            <Videos data={this.state.videos} />
          ) : (
            <center>
              <Loader type="Rings" color="#ff002a" height="100" width="100" />
            </center>
          )}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

window.goToVideo = l => {
  window.location = l;
};

export default Home;
