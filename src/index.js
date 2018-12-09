import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './components/Login';
import EditProfile from './components/EditProfile';
import Video from './components/Videos'
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<HashRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/edit" component={EditProfile} />
            <Route exact path="/videos" component={Video} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
registerServiceWorker();
