import React from 'react';
import Nav from './nav';
import { Button } from 'react-bootstrap';
import Feed from './feed';
import $ from 'jquery';
import { hashHistory } from 'react-router';
import Config from './config';

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount () {
    var self = this;
    window.fbAsyncInit = function() {
      FB.init({
        appId      : Config.FACEBOOK_APP_ID,
        xfbml      : true,
        version    : 'v2.6'
      });
      console.log('initializing fbook', window.FB);
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  submitHandler (startDate, endDate, endpoint, arcId, updateDOM) {

      FB.api('me/photos?fields=images,created_time&limit=2000&type=uploaded&until='+endDate+'&since='+startDate+'&access_token='+sessionStorage.getItem('access_token'), function (response) {
        console.log('submitHandler response', response);
        var data = {
          id: sessionStorage.getItem('fbId'),
          photos: response
        };

        // We need this when we update the database
        if (arcId) {
          data.arcId = arcId;
        }
        data.startDate = startDate;
        data.endDate = endDate;

        // console.log('Data from submitHandler ===============>', data);

        // console.log('submitHandler data', data);
        // console.log('No picture ==================>', data.photos.data.length);
        if ( data.photos.data.length > 0 ) {
          $.post({
            url: endpoint,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function() {
              console.log('SUCCESS in submitHandler');
              if (updateDOM) {
                updateDOM();
              }
              hashHistory.push('dashboard');
            },
            error: function() {
              console.log('ERROR in submitHandler');
            }
          });
        }
      });
  }

    render () {

      // pass submitHandler to form and all child components
      const childrenWithProps = React.Children.map(this.props.children,
         (child) => React.cloneElement(child, {
           submitHandler: this.submitHandler
         })
        );

      return (
        <div>
          <header>
            <Nav />
          </header>

          {childrenWithProps}

        </div>
      );
    }
};

export default Main;
