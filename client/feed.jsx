import React from 'react';
import ReactDOM from 'react-dom';
import Arc from './arc';
import $ from 'jquery';
import Edit from './edit';


// expecting to be passed an array of urls in props

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arcs: [],
      count: 0
    }
    // this.componentDidMount.bind(this);
    // this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {

    // var self = this;
    $.get('/dashboard', {user_id: sessionStorage.getItem('fbId')}, function(data) {
      console.log("Data from db =>", data);

      // data = data.filter(function(val) {
      //   console.log(val);
      //   if (val.length > 0) {
      //     self.state.arcs.push(val);
      //     console.log('filter function', self.state.arcs);
      //     self.forceUpdate();

      //     return true;
      //   } else {
      //     return false;
      //   }
      // });

      this.setState({arcs: data.reverse()});
      // console.log(this.state.arcs);
      // console.log('state is: ', this.state.arcs);
    }.bind(this));
  }

  render() {
    return (
      <div>
        <h2 className="page-title">Your Stories</h2>
        <div className="gallery-container">
         {this.state.arcs.map((arc) => {
           return (
            <div>
              <Arc key={this.state.count++} getData={this.getData.bind(this)} photoArc={arc} />
              <Edit />
            </div>
           );}
         )}
        </div>
      </div>
    )
  }

};


// PropTypes tell other developers what `props` a component expects
// Warnings will be shown in the console when the defined rules are violated
// Feed.propTypes = {
//   arcs: React.PropTypes.array.isRequired
// };

export default Feed;
