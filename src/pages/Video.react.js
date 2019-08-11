// @flow

import React, { Component } from "react";
import { Page, Grid, GalleryCard } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from "react-player";
import Moment from "react-moment";
import Disqus from "disqus-react";
import config from "../config/config";
import YouTube from "react-youtube";
import { FacebookProvider, Comments } from 'react-facebook';
import { ResponsiveImage, ResponsiveImageSize } from 'react-responsive-image';
import data from '../data/video'

const LS_KEY = "frontrow";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: this.props.location.pathname.split("/")[2],
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
      type: "",
      videos: []
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
        if (json.success == true) {
          
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

          fetch(config.api.serverUrl + "/video/get/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              authorization: localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              main_category: json.data[0].main_category,  
              sub_category: json.data[0].sub_category,
              uniqueIdentifierList: [this.state.vid],
              language: json.data[0].language,
              sort: {
                totalViews: -1
              }
            })
          })
          .then(response => {
            return response.json();
          })
          .then(json1 => {
            json1 = json1 || []
            if(json1) {

              if(json1.data.length < 8) {
                let uniqueIdentifierList = [this.state.vid];

                for(let iii = 0; iii < json1.data.length; iii++) {
                  uniqueIdentifierList.push(json1.data[iii].uniqueIdentifier)
                }
                
                fetch(config.api.serverUrl + "/video/get/", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwt")
                  },
                  body: JSON.stringify({
                    main_category: json.data[0].main_category,  
                    language: json.data[0].language,
                    uniqueIdentifierList,
                    sort: {
                      totalViews: -1
                    }
                  })
                })
                .then(response => {
                  return response.json();
                })
                .then(json2 => {
                  json2 = json2 || []
                  if(json2) {
                    if(json2.data.length < 8) {

                      let uniqueIdentifierList = [this.state.vid];

                      for(let iii = 0; iii < json1.data.length; iii++) {
                        uniqueIdentifierList.push(json1.data[iii].uniqueIdentifier)
                      }

                      
                      for(let iii = 0; iii < json2.data.length; iii++) {
                        uniqueIdentifierList.push(json2.data[iii].uniqueIdentifier)
                      }

                      fetch(config.api.serverUrl + "/video/get/", {
                        method: "POST",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          authorization: localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                          main_category: json.data[0].main_category,  
                          uniqueIdentifierList,
                          sort: {
                            totalViews: -1
                          }
                        })
                      })
                      .then(response => {
                        return response.json();
                      })
                      .then(json3 => {
                        json3 = json3 || []
                        if(json3) {
                          this.setState({
                            videos: json1.data.concat(json2.data).concat(json3.data),
                          });
                        } 
                      });
                    } else {
                      this.setState({
                        videos: json1.data.concat(json2.data),
                      });
                    }

                    
                  } 
                });
              } else {
                this.setState({
                  videos: json1.data,
                });
              }
            } 
          });

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

    const Videos = ({ data }) => (
      <Grid.Row>
        {data.map((video, i) => {
          var p = <Moment fromNow>{video.publishedOn}</Moment>;
          var link = "/video/" + video.uniqueIdentifier;

          if(i < 8) {
            return (
              <Grid.Col xl={3} lg={3} md={12} sm={12} xs={12}>
                <div
                  style={{ 
                    cursor: "pointer"
                  }}
                  onClick={() => this.setState({
                    redirect: link
                  })}
                >
                  <GalleryCard key={i}>
                    <GalleryCard.Image src={video.imageURL} />
                    <GalleryCard.Footer>
                      <GalleryCard.Details
                        //avatarURL="https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png"
                        fullName={
                          video.title /*+
                          (video.username
                            ? " uploaded by " + video.username.toString()
                            : "")*/
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
          }
        })}
      </Grid.Row>
    );

    return (
      <div>
        <Page.Content className="videos">
          <Grid.Row>
            <Grid.Col md={12}>
              <div style={{
                textAlign: 'center'
              }}>
                <a target="_blank" href={data.header_ad.url}>
                  <img src={data.header_ad.image} />
                </a>
              </div>
              <br></br>
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
                        height="100%"
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
                              autoplay: 0
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
                              autoplay: 0
                            }
                          }}
                        />
                      </div>
                    }

                    {this.state.type === 'youtube_playlist' &&
                      <div class="player_cover">
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/videoseries?list=${this.state.videoURL}&autoplay=1`} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
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
              <div>
                <Page.Header
                  title="You May Like"
                />
                <Videos data={this.state.videos} />
              </div>
              <div style={{
                textAlign: 'center'
              }}>
                <a target="_blank" href={data.footer_ad.url}>
                  <img src={data.footer_ad.image} />
                </a>
              </div>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
        
      </div>
    );
  }
}

export default Video;
