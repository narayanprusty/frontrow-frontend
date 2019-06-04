// @flow

import React, { Component } from "react";
import { Page, Grid, GalleryCard } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from "react-player";
import Moment from "react-moment";
import Disqus from "disqus-react";
import config from "../config/config";
import YouTube from "react-youtube";

const LS_KEY = "frontrow";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: JSON.stringify(this.props.location.pathname.split("/")[2]),
      adId: "",
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
      height: "",
      bannerImageLoaded: false,
      type: ""
    };
    this.OnVideoRead = this.OnVideoRead.bind(this);
    this.updateView = this.updateView.bind(this);
    this.getuploader = this.getuploader.bind(this);
    this.onDuration = this.onDuration.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.getuploader = this.getuploader.bind(this);
    this.resize = this.resize.bind(this);
  }

  getuploader = e => {
    console.log(e);
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
    this.OnVideoRead();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  OnVideoRead() {
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
          console.log(json.data[0])
          this.setState({
            title: json.data[0].title,
            views: json.data[0].totalViews + 1,
            publishDate: json.data[0].publishedOn,
            videoURL: json.data[0].video,
            username: json.data[0].username,
            type: json.data[0].videoType
          });
          this.updateView(json.data[0].totalViews + 1);
          this.getuploader("0x" + json.data[0].uploader);
        } else {
          alert("Error");
        }
      })
      .catch(console.log);
  }

  onDuration = duration => {
    this.setState({ duration });
  };

  onProgress = e => {
    /*
    var played = this.state.duration * e.played;
    var seconds = parseInt(played);
    if (seconds < 5) {
      this.setState({ lastAdShowedOn: 0 });
    }
    if (
      seconds % 5 == 0 &&
      seconds > this.state.lastAdShowedOn &&
      !this.state.fetchingAd
    ) {
      var auth = localStorage.getItem(LS_KEY)
        ? localStorage.getItem(LS_KEY).replace(/\"/g, "")
        : "";
      fetch(config.api.serverUrl + "/adv/banner", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Bearer " + auth
        }
      })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.setState({
            playing: false,
            lastAdShowedOn: seconds,
            showingAd: true,
            bannerURL: json.bannerUrl,
            bannerImageLoaded: false,
            adId: json.uniqueIdentifier,
            redirectURL: json.redirectURL
          });
        })
        .catch(console.log);
    }
    */
  };

  imageExists = async image_url => {
    var http = new XMLHttpRequest();

    await http.open("HEAD", image_url, false);
    await http.send();

    return http.status != 404;
  };

  markAdSeen = (adId, vId) => {
    var auth = localStorage.getItem(LS_KEY)
      ? localStorage.getItem(LS_KEY).replace(/\"/g, "")
      : "";
    fetch(config.api.serverUrl + "/adv/seen", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + auth
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
        this.setState({ playing: true, showingAd: false, bannerURL: "" });
        this.markAdSeen(this.state.adId, this.state.vid.replace(/\"/g, ""));
      }.bind(this),
      5000
    );
  }

  handleImageErrored() {
    console.log("Unable to load banner image", this.state.bannerURL);
    this.setState({ playing: true, showingAd: false, bannerURL: "" });
  }

  render() {
    const disqusShortname = "frontrow";
    const disqusConfig = {
      url: window.location.href,
      identifier: this.state.vid,
      title: this.state.title
    };

    if (this.state.publishDate) {
      var p = <Moment fromNow>{this.state.publishDate}</Moment>;
    } else {
      var p = <span />;
    }

    let fullName = this.state.title;
    if (this.state.uploadername) {
      fullName = fullName + " by " + this.state.uploadername;
    }

    return (
      <div>
        <Page.Content>
          <Grid.Col sm={12} lg={12}>
            <div>
              <GalleryCard>
                <div
                  style={{ display: this.state.showingAd ? "none" : "block" }}
                  ref={div => {
                    this.div = div;
                  }}
                >
                  {(this.state.type === 'file' || this.state.type === 'live') &&
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
                  }
                  
                  {this.state.type === 'youtube_video' &&
                    <div class="player_cover">
                      <YouTube
                        videoId={this.state.videoURL}
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: { 
                            autoplay: 1
                          }
                        }}
                      />
                    </div>
                  }

                  {this.state.type === 'youtube_live' &&
                    <div class="player_cover">
                      <YouTube
                        videoId={this.state.videoURL}
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: { 
                            autoplay: 1
                          }
                        }}
                      />
                    </div>
                  }

                  {this.state.type === 'youtube_playlist' &&
                    <div class="player_cover">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/videoseries?list=${this.state.videoURL}`} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                  }
                </div>
                <div
                  style={{ display: this.state.showingAd ? "block" : "none" }}
                >
                  <a href={this.state.redirectURL} target="_blank">
                    <img
                      width="100%"
                      height={this.state.height}
                      src={this.state.bannerURL}
                      onLoad={this.handleImageLoaded.bind(this)}
                      onError={this.handleImageErrored.bind(this)}
                    />
                  </a>
                  
                </div>
                <div className="pt-2" />
                <GalleryCard.Footer>
                  <GalleryCard.Details
                    //avatarURL="https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png"
                    fullName={
                      this.state
                        .title /*+
                      (this.state.username
                        ? " uploaded by " + this.state.username.toString()
                        : "")*/
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
      </div>
    );
  }
}

export default Video;
