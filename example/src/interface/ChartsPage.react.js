// @flow

import React, { Component } from "react";
import { Page, Grid, GalleryCard } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";
import ReactPlayer from "react-player";
import Moment from "react-moment";
import Disqus from "disqus-react";

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
    };
    this.OneVideoRead = this.OneVideoRead.bind(this);
    this.updateView = this.updateView.bind(this);
    this.getuploader = this.getuploader.bind(this);
  }

  getuploader(e) {
    fetch("http://localhost:7000/user/get/" + e, {
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
        if (json.data[0] == undefined) return;
        {
          json.data[0].username == undefined
            ? this.setState({ uploadername: null })
            : this.setState({ uploadername: json.data[0].username });
        }
      });
  }

  updateView(e) {
    var vid = this.state.vid;
    fetch("http://localhost:7000/view/update/", {
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
      });
  }

  componentDidMount() {
    this.OneVideoRead();
  }

  OneVideoRead() {
    var vid = this.state.vid;
    fetch("http://localhost:7000/video/get/" + vid.replace(/\"/g, ""), {
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
            username: json.data[0].username
          });
          this.updateView(json.data[0].totalViews + 1);
          this.getuploader(json.data[0].uploader);
        } else {
          alert("Error");
        }
      });
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
                <div>
                  <ReactPlayer
                    url={this.state.videoURL}
                    controls={true}
                    width="100%"
                    height="50%"
                  />
                </div>
                <div className="pt-2" />
                <GalleryCard.Footer>
                  <GalleryCard.Details
                    avatarURL="https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png"
                    fullName={fullName}
                    dateString={p}
                  />
                  <GalleryCard.IconGroup>
                    <GalleryCard.IconItem name="eye" label={this.state.views} />
                  </GalleryCard.IconGroup>
                </GalleryCard.Footer>
                <div className="d-flex align-items-center px-2">
                <small>{this.state.username ? "Uploaded by: "+this.state.username.toString() : ""}</small>
                </div>
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
