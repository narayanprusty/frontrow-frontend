import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import Main from './components/Main';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<HashRouter>
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Main} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
registerServiceWorker();
