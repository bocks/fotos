import Config from './config';
import React from 'react';
import { hashHistory } from 'react-router';

class FacebookPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPosted: false
    }
  }

  componentDidMount() {
    var self = this;
    window.fbAsyncInit = function() {
      FB.init({
        appId      : Config.FACEBOOK_APP_ID,
        xfbml      : true,
        version    : 'v2.6'
      });

      console.log('FB Init', window.FB);
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = '//connect.facebook.net/en_US/sdk.js';
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  shareCollageToFacebook() {
    console.log('shareCollageToFacebook Called');
    this.setState({ hasPosted: 'Saving...' });

    FB.api(
      'me/photos',
      'post',
      {
        message: 'Example Photo Share',
        status: 'success',
        url: 'http://i.imgur.com/ibLnsac.jpg',
        access_token: sessionStorage.getItem('access_token'),
      },
      function(response) {
        console.log('FacebookPost shareCollageToFacebook', response);
        if (response.id) {
          console.log('FacebookPost shareCollageToFacebook Success');
          this.setState({ hasPosted: true });
        }
      }.bind(this)
    );

  }

  render() {
    console.log('FacebookPost render');

    return (
      <div>
        <h1>FacebookPost Render</h1>
        <button type="button" onClick={this.shareCollageToFacebook.bind(this)}>Share Collage</button>
        <p>{this.state.hasPosted.toString()}</p>
      </div>
    )
  }
};

export default FacebookPost;
