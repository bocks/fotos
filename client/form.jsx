import React from 'react';

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
	}

	handleSubmit (e) {
		e.preventDefault();
		// console.log("start is", this.state.startDate);
		// console.log("end is", this.state.endDate);

    // Make sure the startDate is before or the same as the endDate
    if ( this.state.startDate <= this.state.endDate ) {
      this.props.submitHandler(this.state.startDate, this.state.endDate, '/create');
    }

	}

	dropdownSelect (e) {
		this.setState({options: e.target.value});
	}

	render () {
    console.log('rendering form.jsx');
		return (
      <div>
        <h2 className='page-title'>Create New Story</h2>
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
      </div>
		)
	}

};

export default Form;
