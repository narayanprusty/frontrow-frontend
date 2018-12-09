import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import Main from './components/Main';
import Video from './components/Videos'
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<HashRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Main} />
            <Route exact path="/videos" component={Video} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
registerServiceWorker();
