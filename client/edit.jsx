import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Link, hashHistory } from 'react-router';


class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'none',
      startDate: null,
      endDate: null,
      options: null
    };
    this.swapVisibility = this.swapVisibility.bind(this);
    this.removeGallery = this.removeGallery.bind(this);
    this.dropdownSelect = this.dropdownSelect.bind(this);
  }

  dropdownSelect (e) {
    this.setState({options: e.target.value});
  }

  swapVisibility() {
    var val = (this.state.visible === 'none') ? 'block' : 'none';
    this.setState({ visible: val });
  }

  handleSubmit (e) {
    e.preventDefault();

    // Make sure the startDate is before or the same as the endDate
    if ( this.state.startDate <= this.state.endDate ) {
      this.props.submitHandler(this.state.startDate, this.state.endDate, '/update', this.props.photoArc[0].arcId, this.props.getData.bind(this));
    }
  }

  removeGallery () {
    // ajax call to database
    if (this.props.photoArc[0]) {
      var context = this;
      $.ajax({
        method: 'DELETE',
        url: '/remove',
        data: {arcId: this.props.photoArc[0].arcId}
      })
      .done(function(res) {
        context.props.getData();
        // close edit panel before removing storyArc
        context.swapVisibility();
      });
    } else {
      console.log(this.props.photoArc[0]);
    }
  }

  render() {
    return (
          <div className='edit-panel'>
            <button onClick={this.swapVisibility.bind(this)}>Select</button>
            <div className='inputForm' style={{ 'display': this.state.visible }}>
              <form>
                <div>
                  <button onClick={this.removeGallery.bind(this.props.photoArc)}>Remove</button>
                  <button type="submit" onClick={this.handleSubmit.bind(this)}>Change Dates</button>
                  <div className='share-link'><Link to={'/post/' + this.props.photoArc[0].arcId}><button>Share Collage{this.props.photoArc[0].arcId}</button></Link></div>
                </div>
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
              </form>
            </div>
          </div>
        );
  }
}

export default Edit;
