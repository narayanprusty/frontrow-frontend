// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import Web3 from "web3";
import {
  Site,
  Nav,
  Grid,
  List,
  Button,
  RouterContextProvider,
  Icon
} from "tabler-react";

import type { NotificationProps } from "tabler-react";

type Props = {|
  +children: React.Node
|};

type subNavItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +LinkComponent?: React.ElementType
|};

type navItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +active?: boolean,
  +LinkComponent?: React.ElementType,
  +subItems?: Array<subNavItem>,
  +useExact?: boolean
|};

const navBarItems: Array<navItem> = [
  {
    value: "Videos",
    to: "/",
    icon: "video",
    LinkComponent: withRouter(NavLink),
    useExact: true
  },
  /*
  {
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
  */
  {
    value: "Add Video",
    to: "/form-elements",
    icon: "check-square",
    LinkComponent: withRouter(NavLink)
  }
  /*
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
  }
  */
];

var LS_KEY = "frontrow";
var web3 = null;
var add = "";

class SiteWrapper extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      auth: localStorage.getItem(LS_KEY) || undefined,
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
    this.Login = this.Login.bind(this);
  }

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth: auth });
  };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: null });
  };

  handleSignup = publicAddress =>
    fetch(`http://localhost:7000/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(response => response.json());

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
    return fetch(`http://localhost:7000/auth`, {
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
      return alert("Please install Metamask!");
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    this.setState({ loading: true });

    try {
      var nonce = "";
      var response = await fetch(
        `http://localhost:7000/users?publicAddress=${add[0]}`
      );
      var data = await response.json();
      if (data.users.length !== 0) {
        nonce = await data.users[0].nonce;
      } else {
        nonce = await this.handleSignup(add[0]);
        nonce = await nonce.nonce;
      }

      var sig = await this.handleSignMessage(add[0], nonce);
      var token = await this.handleAuthenticate(add[0], sig);
      var auth = await token.token;
      var login = await this.handleLoggedIn(auth);
      await this.setState({ loading: false });
    } catch (e) {
      window.alert(e);
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
        name: "Guest Account",
        description: "Anonymous Mode",
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
          href: "/",
          alt: "Tabler React",
          imageURL: "./demo/brand/tabler.svg",
          accountDropdown: accountDropdownProps
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
          links: [
            <a href="#">First Link</a>,
            <a href="#">Second Link</a>,
            <a href="#">Third Link</a>,
            <a href="#">Fourth Link</a>,
            <a href="#">Five Link</a>,
            <a href="#">Sixth Link</a>,
            <a href="#">Seventh Link</a>,
            <a href="#">Eigth Link</a>
          ],
          note:
            "Premium and Open Source dashboard template with responsive and high quality UI. For Free!",
          copyright: (
            <React.Fragment>
              Copyright © 2018
              <a href="."> Tabler-react</a>. Theme by
              <a
                href="https://codecalm.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                codecalm.net
              </a>{" "}
              All rights reserved.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a href="./docs/index.html">Documentation</a>
                  </List.Item>
                  <List.Item className="list-inline-item">
                    <a href="./faq.html">FAQ</a>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true}>
                <Button
                  href="https://github.com/tabler/tabler-react"
                  size="sm"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  Source code
                </Button>
              </Grid.Col>
            </React.Fragment>
          )
        }}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default SiteWrapper;
