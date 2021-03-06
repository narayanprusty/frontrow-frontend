// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import Web3 from "web3";
import jwtDecode from "jwt-decode";
import {
  Site,
  Nav,
  Grid,
  List,
  Button,
  RouterContextProvider,
  Icon
} from "tabler-react";
import config from "./config/config";
import SweetAlert from "react-bootstrap-sweetalert";

import type { NotificationProps } from "tabler-react";

import ReactGA from 'react-ga';

const navBarItems: Array<navItem> = [
    {
      value: "Home",
      to: "/",
      icon: "home",
      LinkComponent: withRouter(NavLink),
      useExact: true
    },
    {
      value: "Live TV",
      to: "/live-tv",
      icon: "video",
      LinkComponent: withRouter(NavLink),
      useExact: true
    },
    {
      value: "Movies",
      to: "/movies",
      icon: "film",
      LinkComponent: withRouter(NavLink),
      useExact: true
    },
    {
      value: "Music",
      to: "/music",
      icon: "music",
      LinkComponent: withRouter(NavLink),
      useExact: true
    },
    {
      value: "Videos",
      to: "/videos",
      icon: "file",
      LinkComponent: withRouter(NavLink),
      useExact: true
    }
  /*{
    value: "Interface",
    icon: "box",
    subItems: [
      {
        value: "Cards Design",
        to: "/cards",
        LinkComponent: withRouter(NavLink)
      },
      { value: "Charts", to: "/charts", LinkComponent: withRouter(NavLink) },
      {
        value: "Pricing Cards",
        to: "/pricing-cards",
        LinkComponent: withRouter(NavLink)
      }
    ]
  },
  {
    value: "Components",
    icon: "calendar",
    subItems: [
      { value: "Maps", to: "/maps", LinkComponent: withRouter(NavLink) },
      { value: "Icons", to: "/icons", LinkComponent: withRouter(NavLink) },
      { value: "Store", to: "/store", LinkComponent: withRouter(NavLink) },
      { value: "Blog", to: "/blog", LinkComponent: withRouter(NavLink) }
    ]
  },
  {
    value: "Pages",
    icon: "file",
    subItems: [
      { value: "Profile", to: "/profile", LinkComponent: withRouter(NavLink) },
      { value: "Login", to: "/login", LinkComponent: withRouter(NavLink) },
      {
        value: "Register",
        to: "/register",
        LinkComponent: withRouter(NavLink)
      },
      {
        value: "Forgot password",
        to: "/forgot-password",
        LinkComponent: withRouter(NavLink)
      },
      { value: "400 error", to: "/400", LinkComponent: withRouter(NavLink) },
      { value: "401 error", to: "/401", LinkComponent: withRouter(NavLink) },
      { value: "403 error", to: "/403", LinkComponent: withRouter(NavLink) },
      { value: "404 error", to: "/404", LinkComponent: withRouter(NavLink) },
      { value: "500 error", to: "/500", LinkComponent: withRouter(NavLink) },
      { value: "503 error", to: "/503", LinkComponent: withRouter(NavLink) },
      { value: "Email", to: "/email", LinkComponent: withRouter(NavLink) },
      {
        value: "Empty page",
        to: "/empty-page",
        LinkComponent: withRouter(NavLink)
      },
      { value: "RTL", to: "/rtl", LinkComponent: withRouter(NavLink) }
    ]
  },
  {
    value: "Gallery",
    to: "/gallery",
    icon: "image",
    LinkComponent: withRouter(NavLink)
  },
  {
    icon: "file-text",
    value: "Documentation",
    to:
      process.env.NODE_ENV === "production"
        ? "https://tabler.github.io/tabler-react/documentation"
        : "/documentation"
  }*/
];

var LS_KEY = "frontrow";
var web3 = null;
var add = "";

class SiteWrapper extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    
    ReactGA.initialize('UA-147457612-1'); // Here we should use our GA id
    this.props.history.listen(location => ReactGA.pageview(location.pathname));


    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
      username: "",
      navBarItems: navBarItems,
      notificationsObjects: [
        {
          unread: true,
          avatarURL: "demo/faces/male/41.jpg",
          message: (
            <React.Fragment>
              <strong>Nathan</strong> pushed new commit: Fix page load
              performance issue.
            </React.Fragment>
          ),
          time: "10 minutes ago"
        }
      ]
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.Login = this.Login.bind(this);
    this.getuser = this.getuser.bind(this);

    let items = this.state.navBarItems;
  }

  getuser(e) {
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
      if (json.data === undefined) {
        return;
      } else {
        if(json.data[0].username == undefined) {
          this.setState({ username: null })
        } else {
          this.setState({ username: json.data[0].username });
        }


        if(!json.data[0].admin) {
          this.setState({ admin: null })
        } else {
          this.setState({ admin: true });

          let items = this.state.navBarItems;
          items.push({
            value: "Add Video",
            to: "/add-video",
            icon: "check-square",
            LinkComponent: withRouter(NavLink)
          })
          items.push({
            value: "Publish Ads & Summery",
            to: "/publish-ads",
            icon: "box",
            LinkComponent: withRouter(NavLink)
          })

          this.setState({
            navBarItems: items
          })
        }
      }
    });
  }

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth: auth });
    if (!this.state.username) window.location = "/profile";
  };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: null });
    window.location = "/"
  };

  handleSignup = async publicAddress => {
    console.log("Sign up with ", add[0]);
    var response = await fetch(`${config.api.serverUrl}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    console.log(response);
    return response.json();
  };

  handleSignMessage = (publicAddress, nonce) => {
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(
        web3.utils.fromUtf8(`I am signing my one-time nonce: ` + nonce),
        publicAddress,
        (err, signature) => {
          if (err) {
            return reject(err);
          }
          return resolve(signature);
        }
      )
    );
  };

  handleAuthenticate = (publicAddress, signature) => {
    return fetch(`${config.api.serverUrl}/auth`, {
      body: JSON.stringify({
        publicAddress: publicAddress,
        signature: signature
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(response => {
      return response.json();
    });
  };

  componentDidMount() {
    var accesstoken = this.state.auth;
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

        this.getuser(user.publicAddress);
      });
  }

  Init = async () => {
    if (!window.ethereum) {
      return;
    }
    window.web3 = new Web3(window.ethereum);
    add = await window.ethereum.enable();
    await this.setState({ address: add[0] });
  };

  Login = async () => {
    await this.Init();

    if (!window.web3) {
      this.setState({
        installMetamask: true
      })
      return;
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    this.setState({ loading: true });

    try {
      var nonce = "";
      var response = await fetch(
        `${config.api.serverUrl}/users?publicAddress=${add[0]}`
      );
      var data = await response.json();
      if (data.users.length > 0) {
        nonce = await data.users[0].nonce;
      } else {
        nonce = await this.handleSignup(add[0]);
        nonce = await nonce.nonce;
      }
      console.log("nonce", nonce);

      var sig = await this.handleSignMessage(add[0], nonce);
      var token = await this.handleAuthenticate(add[0], sig);
      var auth = await token.token;
      var login = await this.handleLoggedIn(auth);
      await this.setState({ loading: false });

      setTimeout(
        function() {
          this.getuser(add[0]);
        }.bind(this),
        4000
      );
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  render(): React.Node {
    const notificationsObjects = this.state.notificationsObjects || [];
    const unreadCount = this.state.notificationsObjects.reduce(
      (a, v) => a || v.unread,
      false
    );

    window.logout = this.handleLoggedOut;
    window.login = this.Login;
    let accountDropdownProps = {};
    if (this.state.auth) {
      accountDropdownProps = {
        avatarURL:
          "https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png",
        name: this.state.username || "Unknown",
        description: "Logged In",
        options: [
          { icon: "user", value: "Profile", to: "/profile" },
          { icon: "log-out", value: "Sign out", to: "javascript:logout();" }
        ]
      };
    } else {
      accountDropdownProps = {
        avatarURL:
          "https://cdn0.iconfinder.com/data/icons/linkedin-ui-colored/48/JD-07-512.png",
        name: "Guest Account",
        description: "Anonymous Mode",
        options: [
          {
            icon: "unlock",
            value: "Login using Metamask",
            to: "javascript:login();"
          }
        ]
      };
    }

    return (
      <Site.Wrapper
        headerProps={{
          href: '/',
          imageURL: "/demo/logo.png",
          accountDropdown: accountDropdownProps
        }}
        navProps={{ itemsObjects: this.state.navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
          links: [
            <a href="http://about.neott.in">About Us</a>,
            <a href="/terms-of-use">Terms of Use</a>,
            <a href="/privacy-policy">Privacy Policy</a>,
            <a href="mailto:hello@neott.in">Contact Us</a>,
          ],
          note:
            "Neott #HarHathMeinTV",
          copyright: (
            <React.Fragment>
              Copyright © 2019
              <a href="."> Neott</a>. All rights reserved.
            </React.Fragment>
          )
        }}
      >
        {this.props.children}
        <span>
          {this.state.installMetamask ? (
            <SweetAlert title="Install Metamask!" onConfirm={() => {
              this.setState({
                installMetamask: false
              })
            }}>
              Please <a href="https://metamask.io/" target="_blank">install Metamask</a>
            </SweetAlert>
          ) : (
            <p />
          )}
        </span>
      </Site.Wrapper>
    );
  }
}

export default withRouter(SiteWrapper);
