// @flow

import React, { Component } from "react";
import { Page, GalleryCard, Container, Grid, Header } from "tabler-react";
import jwtDecode from "jwt-decode";
import SiteWrapper from "./SiteWrapper.react";
import Moment from "react-moment";
import { Redirect } from "react-router";
import Loader from "react-loader-spinner";
import config from "./config/config";
import ImageGallery from 'react-image-gallery';
import ItemsCarousel from 'react-items-carousel';
import Coverflow from 'react-coverflow';
import { StyleRoot } from 'radium';

import "react-image-gallery/styles/css/image-gallery.css";

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
      loadedVideos: false,
      active: 0
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

  _handleClick() {
    var num = Math.floor((Math.random() * 10) + 1);
    this.setState({
      active: num
    });
  }

  render() {

    const images = [
      {
        original: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
        thumbnail: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
      },
      {
        original: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD',
        thumbnail: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD'
      },
      {
        original: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif',
        thumbnail: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif'
      },
      {
        original: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg',
        thumbnail: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg'
      },
      {
        original: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
        thumbnail: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
      },
      {
        original: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD',
        thumbnail: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD'
      },
      {
        original: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif',
        thumbnail: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif'
      },
      {
        original: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg',
        thumbnail: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg'
      },
      {
        original: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
        thumbnail: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
      },
      {
        original: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD',
        thumbnail: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD'
      },
      {
        original: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif',
        thumbnail: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif'
      },
      {
        original: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg',
        thumbnail: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg'
      },
      {
        original: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
        thumbnail: 'https://s01.sgp1.cdn.digitaloceanspaces.com/article/115327-vkjgezdcuh-1552657284.jpeg',
      },
      {
        original: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD',
        thumbnail: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/raw-john-poster_d.jpeg?Zg1lIHIC5OvXz._2NAzAlBo9x3NVesYD'
      },
      {
        original: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif',
        thumbnail: 'http://www.dssc.co/delhi/wp-content/uploads/sites/2/2018/05/Featured-Image-Raazi-3-zeenewsIndiaCom.gif'
      },
      {
        original: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg',
        thumbnail: 'https://d1u4oo4rb13yy8.cloudfront.net/article/51551-zbxsfewbrl-1487192073.jpg'
      }
    ]

    //<GalleryCard.IconItem name="heart" label={} right />
    const Videos = ({ data }) => (
      <Container className="row row-cards">
        {data.map(function(video, i) {
          var p = <Moment fromNow>{video.publishedOn}</Moment>;
          var link = "/video/" + video.uniqueIdentifier;
          return (
            <Grid.Col sm={12} md={4} lg={3} key={i}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => window.goToVideo(link)}
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
      </Container>
    );

    return (
      <div>
        <Page.Content className="homepage">
          {this.state.loadedVideos ? (
            <div>
              <ImageGallery items={images} autoPlay={false} showFullscreenButton={false} showPlayButton={true} onPlay={(index) => {alert(index)}}  />
              
              <Header.H3 className="mt-4">Live TV </Header.H3> <a className="seemore" href="">View More</a> 
              {/*<Videos data={this.state.videos} />*/}
              <div style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
                <ItemsCarousel
                  gutter={12}
                  activePosition={'center'}
                  chevronWidth={60}
                  numberOfCards={3}
                  slidesToScroll={3}
                  outsideChevron={false}
                  showSlither={false}
                  firstAndLastGutter={false}
                  activeItemIndex={this.state.activeItemIndexA}
                  requestToChangeActive={value => this.setState({ activeItemIndexA: value })}
                  rightChevron={<div class="image-gallery-right-nav"></div>}
                  leftChevron={<div class="image-gallery-left-nav"></div>}
                >
                  {Array.from(new Array(10)).map((_, i) =>
                    <div key={i} style={{
                      cursor: "pointer"
                    }}>
                      <img style={{
                        width: '100%',
                      }} src="https://s3.ap-southeast-1.amazonaws.com/images.deccanchronicle.com/dc-Cover-pjnahrr0r83s6i4udepqspdel7-20180906164434.Medi.jpeg" />
                    </div>
                  )}
                </ItemsCarousel>
              </div>
              <Header.H3 className="mt-4">Latest Movies </Header.H3> <a className="seemore" href="">View More</a> 
              <div>
                <StyleRoot>
                  <Coverflow
                    displayQuantityOfSide={2}
                    navigation
                    infiniteScroll
                    enableHeading
                  >
                    <img src='https://ichef.bbci.co.uk/news/660/media/images/69420000/jpg/_69420006__mg_0209.jpg' alt='Album one' data-action="https://facebook.github.io/react/"/>
                    <img src='https://ichef.bbci.co.uk/news/660/media/images/69420000/jpg/_69420006__mg_0209.jpg' alt='Album two' data-action="http://passer.cc"/>
                    <img src='https://ichef.bbci.co.uk/news/660/media/images/69420000/jpg/_69420006__mg_0209.jpg' alt='Album three' data-action="https://doce.cc/"/>
                    <img src='https://ichef.bbci.co.uk/news/660/media/images/69420000/jpg/_69420006__mg_0209.jpg' alt='Album four' data-action="http://tw.yahoo.com"/>
                  </Coverflow>
                </StyleRoot>
              </div>
              <Header.H3 className="mt-4">Comedy </Header.H3> <a className="seemore" href="">View More</a> 
              <div style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
                <ItemsCarousel
                  gutter={12}
                  activePosition={'center'}
                  chevronWidth={60}
                  numberOfCards={3}
                  slidesToScroll={3}
                  outsideChevron={false}
                  showSlither={false}
                  firstAndLastGutter={false}
                  activeItemIndex={this.state.activeItemIndexB}
                  requestToChangeActive={value => this.setState({ activeItemIndexB: value })}
                  rightChevron={<div class="image-gallery-right-nav"></div>}
                  leftChevron={<div class="image-gallery-left-nav"></div>}
                >
                  {Array.from(new Array(10)).map((_, i) =>
                    <div key={i} style={{
                      cursor: "pointer"
                    }}>
                      <img style={{
                        width: '100%',
                      }} src="https://dc-cdn.s3-ap-southeast-1.amazonaws.com/dc-Cover-34912i42mms3nbcn6ba0dtpad5-20160812130407.Medi.jpeg" />
                    </div>
                  )}
                </ItemsCarousel>
              </div>
            </div>
          ) : (
            <center>
              <Loader type="Rings" color="#ff002a" height="100" width="100" />
            </center>
          )}
        </Page.Content>
      </div>
    );
  }
}

window.goToVideo = l => {
  window.location = l;
};

export default Home;
