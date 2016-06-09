import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'none'
    };
    this.removeGallery = this.removeGallery.bind(this);
  }

  swapVisibility() {
    var val = (this.state.visible === 'none') ? 'block' : 'none';
    this.setState({ visible: val });
  }

  removeGallery () {
    // ajax call to database
    if (this.props.photoArc[0]) {
      var context = this;
      // then make ajax request with data this.props.photoArc[0].arcId
      $.ajax({
        method: 'DELETE',
        url: '/remove',
        data: {arcId: this.props.photoArc[0].arcId}
      })
      .done(function(res) {
        context.props.getData();
      });
    } else {
      console.log(this.props.photoArc[0]);
    }
  }

  render() {
    return (
          <div>
            <p>
              <button onClick={this.swapVisibility.bind(this)}>Edit</button>
            </p>
            <div className='inputForm' style={{ 'display': this.state.visible }}>
              <form>
                <div>
                  <button onClick={this.removeGallery.bind(this.props.photoArc)}>Remove
                  </button>
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
