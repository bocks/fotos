import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Login from './login';
import Main from './main';
import Feed from './feed';
import Form from './form';
// import { Button } from 'react-bootstrap';
// import $ from 'jquery';



render((
	<Router history={hashHistory}>
    <Route path='/' component={Login}/>
    <Route path='/login' component={Login}/>
    <IndexRoute component={Main}>
      <Route path='create' component={Form}/>
      <Route path='dashboard' component={Feed}/>
    </IndexRoute>
  </Router>
  ), document.getElementsByClassName('mounting')[0]);

