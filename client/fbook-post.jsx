import Config from './config';
import React from 'react';
import { hashHistory } from 'react-router';

class FacebookPost extends React.Component {
  componentDidMount () {
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

  shareCollageToFacebook () {
    console.log({
      message: 'Example Photo Share',
      status: 'success',
      // access_token: sessionStorage.getItem('access_token'),
      access_token: 'EAAQNY7TGjeYBAOSpGOK3ZBTP0ZBI3lSkpwZB6EyqeJA9KkTsZApZADlIoQtQiqLB5EBpEDNAAnlExo0i3ymJBdzZAsWcOHCnZBvWttqt2UYAW5ZCfXn50rddIXo2AQDmqydbfP4oNeBQAJcyQydGH4uFfKSjqrO0dK2y18vTvEHes9X9cxRwDDl7',
      url: 'http://i.imgur.com/ibLnsac.jpg'
    });

    FB.api('me/photos', 'post',
    {
      message: 'Example Photo Share',
      status: 'success',
      access_token: sessionStorage.getItem('access_token'),
      url: 'http://localhost:4000/bowtie-cat.jpg'
    },
    function(response) {
      console.log('FacebookPost shareCollageToFacebook', response);
    });
  }

  render () {
    console.log('FacebookPost render');

    return (
      <div>
        <h1>FacebookPost Render</h1>
        <button type="button" onClick={this.shareCollageToFacebook}>Share Collage</button>
      </div>
    )
  }
};

export default FacebookPost;
