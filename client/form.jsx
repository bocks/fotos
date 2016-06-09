import Config from './config';

import React from 'react';
import $ from 'jquery';
import { hashHistory } from 'react-router';

class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: null,
			endDate: null,
			options: null
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.dropdownSelect = this.dropdownSelect.bind(this);
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

  submitHandler (startDate, endDate, options) {
    console.log(startDate, endDate, 'in submit handler');

    // FB.getLoginStatus(function(response) {
      FB.api('me/photos?fields=images,created_time&limit=2000&type=uploaded&until='+endDate+'&since='+startDate+'&access_token='+sessionStorage.getItem('access_token'), function (response) {
        console.log('submitHandler response', response);
        var data = {
          id: sessionStorage.getItem('fbId'),
          photos: response
        };
        console.log('submitHandler data', data);
        // console.log('No picture ==================>', data.photos.data.length);
        if ( data.photos.data.length > 0 ) {
          $.post({
            url: '/create',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function() {
              console.log('SUCCESS in submitHandler');
              hashHistory.push('dashboard');
            },
            error: function() {
              console.log('ERROR in submitHandler');
            }
          });
        }
      });
    // });
  }

	handleSubmit (e) {
		e.preventDefault();
		console.log("start is", this.state.startDate);
		console.log("end is", this.state.endDate);

    // Make sure the startDate is before or the same as the endDate
    if ( this.state.startDate <= this.state.endDate ) {
      this.submitHandler(this.state.startDate, this.state.endDate);
    }

	}

	dropdownSelect (e) {
		this.setState({options: e.target.value});
	}

	render () {
    console.log('rendering form.jsx');
		return (
			<div className='inputForm'>
        <form>
          <p className='inputs'>
					 <label>Start Date: </label>
           <input type="date" name="startDate" className="datePicker" onChange={(event)=> this.setState({startDate: event.target.value})} />
					</p>
          <p className='inputs'>
            <label>End Date: </label>
            <input type="date" name="endDate" className="datePicker" onChange={(event)=> this.setState({endDate: event.target.value})} />
				  </p>
        {/* <select onChange={this.dropdownSelect}>
						<option></option>
						<option value="filter1">Photos of me</option>
						<option value="filter2"></option>
						<option value="filter3">Photos in other countries</option>
					</select> */}
					<p>
            <button type="submit" onClick={this.handleSubmit}>See your photos</button>
				  </p>
        </form>
      </div>
		)
	}

};

export default Form;
