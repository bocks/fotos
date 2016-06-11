import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Link } from 'react-router';


class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: null,
      endDate: null,
      visible: ['none', 'none'],
      message: ''
    };
    this.swapVisibility = this.swapVisibility.bind(this);
    this.removeGallery = this.removeGallery.bind(this);
    this.showNoPhoto = this.showNoPhoto.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
  }

  showNoPhoto () {
    this.setState({
      visible: ['block', 'block'],
      message: 'No photos to display in this date range'
    });
  }

  // target index is bound to click handler
  swapVisibility() {
    var val = (this.state.visible[arguments[0]] === 'none') ? 'block' : 'none';
    var arr = this.state.visible.slice();
    arr[arguments[0]] = val;
    return arr;
  }

  togglePanel(index) {
    this.setState({ visible: this.swapVisibility(index) });
  }

  handleSubmit (e) {
    e.preventDefault();

    if (this.state.startDate > this.state.endDate) {
      this.setState({
        message: 'Please select a valid date range'
      });
    }

    // Make sure the startDate is before or the same as the endDate
    if ( this.state.startDate <= this.state.endDate ) {
      this.props.submitHandler(this.state.startDate, this.state.endDate, '/update', this.props.photoArc[0].arcId, this.showNoPhoto.bind(this), this.props.getData.bind(this, this.togglePanel.bind(this, 0)));
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
        var swap = context.swapVisibility(0);
        context.setState({visible: swap});
      });
    } else {
      console.log(this.props.photoArc[0]);
    }
  }

  render() {
    return (
          <div className='edit-panel'>
            <button onClick={this.togglePanel.bind(this, 0)}>Select</button>
            <div className='inputForm' style={{ 'display': this.state.visible[0] }}>
              <form>
                <div className='loading' style={ this.state.message.length > 0 ? {'display': 'block'} : {'display': 'none'} }>
                  { this.state.message }
                </div>
                <div>
                  <button><Link to={'/post/' + this.props.photoArc[0].arcId}>Share Collage</Link></button>
                  <button type="submit" onClick={this.togglePanel.bind(this, 1)}>Change Dates</button>
                  <button onClick={this.removeGallery.bind(this.props.photoArc)}>Delete</button>
                </div>
                <fieldset className='loading' style={{ 'display': this.state.visible[1] }}>
                  <p className='inputs'>
                   <label>Start Date: </label>
                   <input type="date" name="startDate" className="datePicker" onChange={(event)=> this.setState({startDate: event.target.value})} />
                  </p>
                  <p className='inputs'>
                    <label>End Date: </label>
                    <input type="date" name="endDate" className="datePicker" onChange={(event)=> this.setState({endDate: event.target.value})} />
                  </p>
                  <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
                </fieldset>
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
