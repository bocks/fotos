import React from 'react';
import ReactDOM from 'react-dom';
import { ReactRpg } from 'react-rpg';

class Grid extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {images: [
      {
        url: 'http://i.imgur.com/Yal1xei.png'
      },{
        url: 'http://90kids.com/wp-content/uploads/2014/04/welcome-to-the-internet-90s.jpg'
      },{
        url: 'http://memesvault.com/wp-content/uploads/Welcome-To-The-Internet-Meme-06.jpg'
      },{
        url: 'http://memesvault.com/wp-content/uploads/Welcome-To-The-Internet-Meme-17.jpg'
      }
    ]};
  };
  
  render () {
    return (
      <div className="photoGrid">
        <ReactRpg imagesArray={this.state.images} columns={[2, 2, 2]} />
      </div>  
    )
  }
};

export default Grid;