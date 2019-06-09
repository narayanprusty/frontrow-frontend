
import React, { Component } from "react";
import { Page, Button, Form, GalleryCard, Container, Grid, Header } from "tabler-react";
import jwtDecode from "jwt-decode";
import SiteWrapper from "../SiteWrapper.react";
import Moment from "react-moment";
import { Redirect } from "react-router";
import Loader from "react-loader-spinner";
import config from "../config/config";
import categories from "../data/videos_categories.json"
import "react-image-gallery/styles/css/image-gallery.css";
import languages from "../data/languages.json"

const LS_KEY = "frontrow";

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //langauge: this.props.location.pathname.split("/")[2],
      //category: this.props.location.pathname.split("/")[3],
      loading: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      send: "",
      ok: false,
      videos: [],
      loadedVideos: false,
      active: 0,
      totalCount: 0,
      skip: 0,
      disableLoadMore: false,
      loadMoreText: 'Load More'
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.VideoRead = this.VideoRead.bind(this);

    this.category = 'all'
    this.language = 'all'
    this.search = ''
    this.skip = 0
  }

  VideoRead() {
    let data = {
      skip: this.skip,
      videoType: ['youtube_video', 'youtube_playlist', 'file']
    }

    if(this.category !== 'all') {
      data.category = this.category
    }

    if(this.language !== 'all') {
      data.language = this.language
    }

    if(this.search) {
      data.search = this.search
    }

    fetch(config.api.serverUrl + "/video/get/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("jwt")
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      json = json || []
      if(json) {
        let videos = this.state.videos 
        this.setState({
          videos: videos.concat(json.data),
          loadedVideos: true,
          totalCount: json.count.message,
          disableLoadMore: false,
          loadMoreText: 'Load More'
        });
      } 
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
  }

  hideAlert() {
    this.setState({ send: "" });
  }

  _handleClick() {
    var num = Math.floor((Math.random() * 10) + 1);
    this.setState({
      active: num
    });
  }

  render() {
    //<GalleryCard.IconItem name="heart" label={} right />
    const Videos = ({ data }) => (
      <Grid.Row>
        {data.map((video, i) => {
          var p = <Moment fromNow>{video.publishedOn}</Moment>;
          var link = "/video/" + video.uniqueIdentifier;
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
        })}
      </Grid.Row>
    );

    const options = (
      <React.Fragment>
        <Form.Select className=" mr-2" name='language' onChange={evt => {
          this.language = evt.target.value
        }}>
          <option value={'all'}>All Languages</option>
          {languages.map((item, i) => {
            return <option key={item.toLowerCase()} value={item.toLowerCase()}>{item}</option>
          })}
        </Form.Select>
        <Form.Select className="mr-2" name='category' onChange={evt => {
          this.category = evt.target.value;
        }}>
          <option value={'all'}>All Categories</option>
          {categories.map((item, i) => {
            if(item.child) {
              return (
                <optgroup key={item.name} label={item.name}>
                  {item.subcategories.map((child) => {
                    return <option key={child.id} value={child.id}>{child.name}</option>                    
                  })}
                </optgroup>
              )
            } else {
              return <option key={item.id} value={item.id}>{item.name}</option>
            }
          })}
        </Form.Select>
        <Form.Input className="w-auto mr-2" icon="search" placeholder="Search Title" onChange={evt => {
          this.search = evt.target.value
        }} />
        <Button color="primary" icon="search" onClick={() => {
          this.skip = 0
          this.setState({
            videos: [],
            totalCount: 0,
            loadedVideos: false
          })

          this.VideoRead()
        }} />
      </React.Fragment>
    );

    let start = this.state.videos.length > 0 ? 1 : ''
    let displayDash = this.state.videos.length > 0 ? '-' : ''
    let displayTill = this.state.videos.length > 0 ? this.state.videos.length : ''
    let displayOf = this.state.videos.length > 0 ? 'of' : ''
    let totalVideos = `${this.state.totalCount} videos`

    let paginationText = `${start} ${displayDash} ${displayTill} ${displayOf} ${totalVideos}`
    return (
      <div>
        <Page.Content className="videos">
          <Page.Header
            title="Videos"
            subTitle={paginationText}
            options={options}
          />
          {this.state.loadedVideos ? (
            <div>
              <Header.H2 className="mt-4"></Header.H2>
              <Videos data={this.state.videos} />
              {this.state.videos.length < this.state.totalCount &&
                <center>
                  <Button icon="plus" color="primary" disabled={this.state.disableLoadMore} outline onClick={() => {
                    let skip = this.skip;
                    skip = skip + 12

                    this.skip = skip
                    
                    this.setState({
                      disableLoadMore: true,
                      loadMoreText: "Loading..."
                    })

                    this.VideoRead()
                  }}>
                    {this.state.loadMoreText}
                  </Button>
                </center>
              }
            </div>
          ) : (
            <center>
              <Loader type="Rings" color="#ff002a" height="100" width="100" />
            </center>
          )}
        </Page.Content>
        {this.state.redirect &&
          <Redirect to={this.state.redirect} />
        }
      </div>
    );
  }
}

export default Videos;
