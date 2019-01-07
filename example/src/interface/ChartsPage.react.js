// @flow

import React, { Component } from "react";
import { Page, Grid, GalleryCard } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from "react-player";
import Moment from "react-moment";
import Disqus from "disqus-react";
import config from "./../config/config";

const LS_KEY = "frontrow";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: JSON.stringify(this.props.location.pathname.split("/")[2]),
      loading: false,
      title: "",
      videoURL: "",
      views: "",
      user: "",
      send: "",
      ok: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      views: "",
      uploadername: "",
      publishDate: "",
      username: "",
      playing: true,
      duration: 0,
      played: 0,
      lastAdShowedOn: 0,
      showingAd: false,
      fetchingAd: false,
      bannerURL: "",
      height: ""
    };
    this.OneVideoRead = this.OneVideoRead.bind(this);
    this.updateView = this.updateView.bind(this);
    this.getuploader = this.getuploader.bind(this);
    this.onDuration = this.onDuration.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.getuploader = this.getuploader.bind(this);
    this.resize = this.resize.bind(this);
  }

  getuploader = e => {
    fetch(config.api.serverUrl + "/user/get/" + e, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(
          "height",
          this.div.clientHeight,
          this.div.clientHeight * 0.8
        );
        this.setState({ height: this.div.clientHeight });
        if (json.data[0] == undefined) return;
        {
          json.data[0].username == undefined
            ? this.setState({ uploadername: null })
            : this.setState({ uploadername: json.data[0].username });
        }
      })
      .catch(console.log);
  };

  updateView(e) {
    var vid = this.state.vid;
    fetch(config.api.serverUrl + "/video/view/update/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: vid.replace(/\"/g, ""),
        views: e
      })
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success == true) {
        } else {
          alert("Error");
        }
      })
      .catch(console.log);
  }

  resize = () => {
    if (this.div.clientHeight > 0)
      this.setState({ height: this.div.clientHeight });
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.OneVideoRead();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  OneVideoRead() {
    var vid = this.state.vid;
    fetch(config.api.serverUrl + "/video/get/" + vid.replace(/\"/g, ""), {
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
        console.log("Video Read", json);
        if (json.success == true) {
          this.setState({
            title: json.data[0].title,
            views: json.data[0].totalViews + 1,
            publishDate: json.data[0].publishedOn,
            videoURL: json.data[0].video,
            username: json.data[0].username
          });
          this.updateView(json.data[0].totalViews + 1);
          this.getuploader(json.data[0].uploader);
        } else {
          alert("Error");
        }
      })
      .catch(console.log);
  }

  onDuration = duration => {
    console.log("onDuration", duration);
    this.setState({ duration });
  };

    onProgress = e => {
        var played = this.state.duration * e.played;
        var seconds = parseInt(played);
        if (seconds < 5) {
            this.setState({ lastAdShowedOn: 0 });
        }
        console.log(seconds);
        if (
            seconds % 7 == 0 &&
            seconds > this.state.lastAdShowedOn &&
            !this.state.fetchingAd
        ) {
            var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
            fetch(config.api.serverUrl + "/adv/banner", {
                method: "GET",
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
                    console.log(json, json.bannerUrl);
                    this.setState({
                        playing: false,
                        lastAdShowedOn: seconds,
                        showingAd: true,
                        bannerURL: json.bannerUrl
                    });

                    setTimeout(
                        function () {
                            this.setState({ playing: true, showingAd: false });
                            this.markAdSeen(
                                json.uniqueIdentifier,
                                this.state.vid.replace(/\"/g, "")
                            );
                        }.bind(this),
                        5000
                    );
                })
                .catch(console.log);
        }
    };

  markAdSeen = (adId, vId) => {
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    fetch(config.api.serverUrl + "/adv/seen", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer " + auth
      },
      body: JSON.stringify({
        adId: adId,
        vId: vId
      })
    });
  };

  handleImageLoaded() {
    setTimeout(
      function() {
        this.setState({ playing: true, showingAd: false });
      }.bind(this),
      5000
    );
  }

  render() {
    const disqusShortname = "frontrow";
    const disqusConfig = {
      url: window.location.href,
      identifier: this.state.vid,
      title: this.state.title
    };

    var p = <Moment fromNow>{this.state.publishDate}</Moment>;
    let fullName = this.state.title;
    if (this.state.uploadername) {
      fullName = fullName + " by " + this.state.uploadername;
    }

    return (
      <SiteWrapper>
        <Page.Content>
          <Grid.Col sm={6} lg={12}>
            <div>
              <GalleryCard>
                <div
                  style={{ display: this.state.showingAd ? "none" : "block" }}
                  ref={div => {
                    this.div = div;
                  }}
                >
                  <ReactPlayer
                    playing={this.state.playing}
                    onDuration={this.onDuration}
                    onProgress={this.onProgress}
                    url={this.state.videoURL}
                    progressInterval={1000}
                    controls={true}
                    width="100%"
                    height="50%"
                  />
                </div>
                <div
                  style={{ display: this.state.showingAd ? "block" : "none" }}
                >
                  <img
                    width="100%"
                    height={this.state.height}
                    src={this.state.bannerURL}
                    onLoad={this.handleImageLoaded.bind(this)}
                  />
                </div>
                <div className="pt-2" />
                <GalleryCard.Footer>
                  <GalleryCard.Details
                    avatarURL="https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png"
                    fullName={
                      fullName +
                      (this.state.username
                        ? " uploaded by " + this.state.username.toString()
                        : "")
                    }
                    dateString={p}
                  />
                  <GalleryCard.IconGroup>
                    <GalleryCard.IconItem name="eye" label={this.state.views} />
                  </GalleryCard.IconGroup>
                </GalleryCard.Footer>
              </GalleryCard>
            </div>
            <Disqus.DiscussionEmbed
              shortname={disqusShortname}
              config={disqusConfig}
            />
          </Grid.Col>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default Video;
