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
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel } from 'react-responsive-carousel';

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

    return (
      <div>
        <Page.Content className="homepage">
          <Carousel autoPlay="true" interval="3000" showArrows={true} onChange={() => {}} onClickItem={(index) => {
            this.setState({
              redirect: `/video/${homeData.section_one[index].videoId}`
            })
          }} onClickThumb={() => {}}>
            {homeData.section_one.map((_, i) => 
              <div key={_.videoId}>
                <img src={_.thumbnail} style={{
                  cursor: "pointer"
                }} />
              </div>
            )}
          </Carousel>
          <Header.H3 className="mt-4">{homeData.section_two.name}</Header.H3> 
          {/*<Videos data={this.state.videos} />*/}
          <div class="home-slider" style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
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
          <div  class="home-slider" style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
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
            </ItemsCarousel>
          </div>

          <Header.H3 className="mt-4">{homeData.section_four.name}</Header.H3>
          <div class="home-slider" style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
            <ItemsCarousel
              gutter={12}
              activePosition={'center'}
              chevronWidth={60}
              numberOfCards={3}
              slidesToScroll={3}
              outsideChevron={false}
              showSlither={false}
              firstAndLastGutter={false}
              activeItemIndex={this.state.activeItemIndexC}
              requestToChangeActive={value => this.setState({ activeItemIndexC: value })}
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
          <div  class="home-slider" style={{"padding":0,"maxWidth":"100%","margin":"0"}}>
            <ItemsCarousel
              gutter={12}
              activePosition={'center'}
              chevronWidth={60}
              numberOfCards={3}
              slidesToScroll={3}
              outsideChevron={false}
              showSlither={false}
              firstAndLastGutter={false}
              activeItemIndex={this.state.activeItemIndexD}
              requestToChangeActive={value => this.setState({ activeItemIndexD: value })}
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
          </div>
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
