// @flow

import React, { Component } from "react";
import {
  Page,
  Card,
  Grid,
  Form,
  Button,
  Dropdown,
  Table,
  Text,
  Icon
} from "tabler-react";
import Select from "react-select";
import SiteWrapper from "../SiteWrapper.react";
import SweetAlert from "react-bootstrap-sweetalert";
import Countries from "../helpers/countries";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { ENGINE_METHOD_DIGESTS } from "constants";
import { stat } from "fs";
import config from "./../config/config";

const LS_KEY = "frontrow";

class PublishAdsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: "",
      country: "",
      loading: false,
      interests: [],
      publish: false,
      ageUpperLimit: "",
      ageLowerLimit: "",
      costPerView: "",
      loadingAdsStats: false,
      adsStats: [],
      auth: localStorage.getItem(LS_KEY) || undefined
    };
    this.getStats = this.getStats.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.publishAd = this.publishAd.bind(this);
    this.getAdsStats = this.getAdsStats.bind(this);
  }

  componentDidMount() {
    if (!this.state.auth) {
      window.location = "/";
    }
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    this.setState({ loadingAdsStats: true });
    fetch(config.api.serverUrl + "/adv/adsStats", {
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
        console.log(json);
        var adsStats = this.getAdsStats(json);
        this.setState({ adsStats: adsStats });
        this.setState({ loadingAdStats: false });
        //return response.json();
      })
      .catch(err => {
        console.log(err);
        this.setState({ loadingAdStats: false });
      });
  }

  getAdsStats = data => {
    var stats = [];
    for (var i = 0; i < data.length; i++) {
      stats.push({
        key: i,
        item: [
          {
            content: (
              <Text RootComponent="span" muted>
                {data[i].uniqueIdentifier}
              </Text>
            )
          },
          {
            content: (
              <a href="invoice.html" className="text-inherit">
                {data[i].views ? data[i].views : 0}
              </a>
            )
          },
          { content: data[i].views ? data[i].views * data[i].costPerView : 0 },
          { content: data[i].costPerView }
        ]
      });
    }
    return stats;
  };

  getStats() {
    this.setState({ loadingStats: true });
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    console.log(auth);
    fetch(config.api.serverUrl + "/adv/getStats", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer " + auth
      },
      body: JSON.stringify({
        country: this.state.country,
        ageUpperLimit: this.state.ageUpperLimit,
        ageLowerLimit: this.state.ageLowerLimit,
        tags: this.state.interests
      })
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        this.setState({ matches: json.data });
        this.setState({ loadingStats: false });
        //return response.json();
      })
      .catch(err => {
        console.log(err);
        this.setState({ loadingStats: false });
      });
  }

  publishAd() {
    var body = {
      costPerView: this.state.costPerView, //how much advertiser pays per view
      filter: JSON.stringify({
        ageLowerLimit: this.state.ageLowerLimit,
        ageUpperLimit: this.state.ageUpperLimit,
        country: this.state.country,
        tags: this.state.tags
      }),
      bannerUrl: this.state.bannerUrl
    };

    this.setState({ loading: true });
    var auth = localStorage.getItem(LS_KEY) ? localStorage.getItem(LS_KEY).replace(/\"/g, "") : "";
    console.log(auth);
    fetch(config.api.serverUrl + "/adv/publish", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Bearer " + auth
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        if (json.success) {
          this.setState({ publish: true });
        } else {
          alert(json.message);
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        alert(err.message);
        this.setState({ loading: false });
      });
  }

  hideAlert() {
    this.setState({ publish: false });
    this.props.history.push(`/`);
  }

  render() {
    return (
      <SiteWrapper>
        {this.state.publish ? (
          <SweetAlert title="Success!" onConfirm={this.hideAlert}>
            Ad published successfully!
          </SweetAlert>
        ) : (
          <p />
        )}
        <Page.Card
          title="Post Ads"
          footer={
            <div>
              <Card.Footer />
            </div>
          }
        >
          <Grid.Row>
            <Grid.Col lg={12}>
              <Form>
                <Grid.Row>
                  <Grid.Col xs={12} sm={6} md={6}>
                    <Form.Group>
                      <Form.Label>From Age</Form.Label>
                      <Form.Input
                        type="number"
                        placeholder="From Age"
                        onChange={evt => {
                          this.setState({ ageLowerLimit: evt.target.value });
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Interests</Form.Label>
                      <TagsInput
                        value={this.state.interests}
                        onChange={e => this.setState({ interests: e })}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Country : {this.state.country}</Form.Label>
                      <Select
                        options={Countries}
                        onChange={evt => {
                          this.setState({ country: evt.label });
                        }}
                      />
                    </Form.Group>
                    <div>
                      Matching users :{" "}
                      {this.state.matches ? this.state.matches : 0}
                    </div>
                  </Grid.Col>
                  <Grid.Col xs={12} sm={6} md={6}>
                    <Form.Group>
                      <Form.Label>To Age</Form.Label>
                      <Form.Input
                        type="number"
                        placeholder="To Age"
                        onChange={evt => {
                          this.setState({ ageUpperLimit: evt.target.value });
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Ad Banner URL</Form.Label>
                      <Form.Input
                        type="text"
                        placeholder="Ad Banner URL"
                        value={this.state.bannerUrl}
                        onChange={evt => {
                          this.setState({ bannerUrl: evt.target.value });
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Cost per view($)</Form.Label>
                      <Form.Input
                        type="number"
                        placeholder="Cost per view($)"
                        onChange={evt => {
                          this.setState({ costPerView: evt.target.value });
                        }}
                      />
                    </Form.Group>
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col lg={12} xs={12} md={12} sm={12}>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ float: "left", marginRight: 10 }}>
                        {this.state.loadingStats ? (
                          <Button disabled className="ml-auto" color="primary">
                            Getting Stats..
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            className="ml-auto"
                            onClick={this.getStats}
                          >
                            Get Stats
                          </Button>
                        )}
                      </div>
                      <div style={{ float: "left", marginBottom: 10 }}>
                        {this.state.loading ? (
                          <Button disabled className="ml-auto" color="primary">
                            Pulishing..
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            className="ml-auto"
                            onClick={this.publishAd}
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  </Grid.Col>
                </Grid.Row>
              </Form>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col width={12}>
              <Card title="Ads Summery">
                <Table
                  responsive
                  className="card-table table-vcenter text-nowrap"
                  headerItems={[
                    { content: "ID.", className: "w-1" },
                    { content: "Views" },
                    { content: "Total Debit($)" },
                    { content: "Cost per view($)" }
                  ]}
                  bodyItems={this.state.adsStats}
                />
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Card>
      </SiteWrapper>
    );
  }
}

export default PublishAdsForm;
