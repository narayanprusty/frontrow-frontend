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
import homeData from './data/home.json';
import { Link } from 'react-router-dom';

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
      active: 0,
      redirect: false
    };
    this.hideAlert = this.hideAlert.bind(this);
  }

  
  componentWillMount() {
    var accesstoken = this.state.auth;
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
          <ImageGallery items={homeData.section_one} autoPlay={false} showFullscreenButton={false} showPlayButton={true} onPlay={(index) => {
            this.setState({
              redirect: `/video/${homeData.section_one[index].videoId}`
            })
          }}  />
          <Header.H3 className="mt-4">{homeData.section_two.name}</Header.H3> 
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
              {homeData.section_two.data.map((_, i) => 
                <div key={_.videoId} style={{
                  cursor: "pointer"
                }}>
                  <Link to={`/video/${_.videoId}`}>
                    <img style={{
                      width: '100%',
                    }} src={_.thumbnail} />
                  </Link>
                </div>
              )}
            </ItemsCarousel>
          </div>
          <Header.H3 className="mt-4">{homeData.section_three.name} </Header.H3>
          <div>
            <StyleRoot>
              <Coverflow
                displayQuantityOfSide={2}
                navigation
                infiniteScroll
                enableHeading
              >
                {homeData.section_three.data.map((_, i) => 
                  <div key={_.videoId} style={{
                    cursor: "pointer"
                  }}>
                    <Link to={`/video/${_.videoId}`}>
                      <img style={{
                        width: '100%',
                      }} src={_.thumbnail} />
                    </Link>
                  </div>
                )}
              </Coverflow>
            </StyleRoot>
          </div>

          {/*<Header.H3 className="mt-4">{homeData.section_four.name}</Header.H3>
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
              {homeData.section_four.data.map((_, i) => 
                <div key={_.videoId} style={{
                  cursor: "pointer"
                }}>
                  <Link to={`/video/${_.videoId}`}>
                    <img style={{
                      width: '100%',
                    }} src={_.thumbnail} />
                  </Link>
                </div>
              )}
            </ItemsCarousel>
          </div>
          <Header.H3 className="mt-4">{homeData.section_five.name}</Header.H3>
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
              {homeData.section_five.data.map((_, i) => 
                <div key={_.videoId} style={{
                  cursor: "pointer"
                }}>
                  <Link to={`/video/${_.videoId}`}>
                    <img style={{
                      width: '100%',
                    }} src={_.thumbnail} />
                  </Link>
                </div>
              )}
            </ItemsCarousel>
          </div>*/}
        </Page.Content>
        {this.state.redirect &&
          <Redirect to={this.state.redirect} />
        }
      </div>
    );
  }
}

window.goToVideo = l => {
  window.location = l;
};

export default Home;
