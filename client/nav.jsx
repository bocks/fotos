import React from 'react';
import ReactBootstrap from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { Link, hashHistory } from 'react-router';
var linkStyle = {marginTop: '15px', color:'white'};

var topNav = (props) => (
	<Navbar className="navbar">
		<Nav className="links">
      <NavItem className="brand">FotoTime</NavItem>
			<Link style={linkStyle} to="/dashboard" activeClassName="active" style={linkStyle}>Dashboard</Link>
			<Link style={linkStyle} to="/create" activeClassName="active" style={linkStyle}>Create new story</Link>
      <Link style={linkStyle} to="/post" activeClassName="active" style={linkStyle}>Post</Link>
		</Nav>
		<Nav pullRight>
			<NavItem className="logout" onClick={() => {
        if (window.FB) {
        	FB.logout();
        }
        hashHistory.push('login');
      }}>Logout</NavItem>
		</Nav>
 </Navbar>
);

export default topNav;

