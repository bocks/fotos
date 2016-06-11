import React from 'react';
import ReactDOM from 'react-dom';
import Arc from './arc';
import $ from 'jquery';
import Edit from './edit';
import { hashHistory } from 'react-router';

// expecting to be passed an array of urls in props
class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arcs: [],
      count: 0
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData(cb) {
    $.get('/dashboard', {
        user_id: sessionStorage.getItem('fbId')
      }, function(data) {
        this.setState({arcs: data.reverse()});
        if (cb) {
          cb();
        }
      }.bind(this));
  }

  render() {

    return (
        <div>
          <h2 className="page-title">Your Stories</h2>
          <div className="gallery-container">
            <div className="loading" style={ this.state.arcs.length === 0 ? {'display': 'block'} : {'display': 'none'} }>
              No Stories to Display...
            </div>

              { this.state.arcs.map((arc, i) => {
                if (this.state.arcs[i][0]) {
                  return (
                    <div className="arc-wrap">
                      <div className="arc-date">
                        <span>From {this.state.arcs[i][0].startDate.toString().slice(0, 10)}  </span>
                        <span>to {this.state.arcs[i][0].endDate.toString().slice(0, 10)}</span>
                      </div>
                      <Arc key={this.state.count++} getData={this.getData.bind(this)} photoArc={arc} />
                      <Edit photoArc={arc} arcs={this.state.arcs} getData={this.getData.bind(this)} submitHandler={this.props.submitHandler}/>
                    </div>
                  );
                }
              })
            }

        </div>
      </div>
    );
  }
};

// PropTypes tell other developers what `props` a component expects
// Warnings will be shown in the console when the defined rules are violated
// Feed.propTypes = {
//   arcs: React.PropTypes.array.isRequired
// };

export default Feed;
