import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Error404,
  Profile,
  PublishAds,
  Video,
  AddVideo
} from "./pages";

import HomePage from "./HomePage.react";

import "tabler-react/dist/Tabler.css";

type Props = {||};

function App(props: Props): React.Node {
  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/video/:id" component={Video} />
          <Route exact path="/add-video" component={AddVideo} />
          <Route exact path="/publish-ads" component={PublishAds} />
          <Route exact path="/profile" component={Profile} />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
