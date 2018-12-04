import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import Profile from './components/Profile';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<HashRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
registerServiceWorker();
