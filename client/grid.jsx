import React from 'react';
import ReactDOM from 'react-dom';
import { ReactRpg } from 'react-rpg';

class Grid extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {images: [
      {
        url: props.photoArc[0].src
      },{
        url: props.photoArc[1].src
      },{
        url: props.photoArc[2].src
      },{
        url: props.photoArc[3].src
      }
    ]};
  };
  
  storeCollage (id, img) {
    $.post({
      url: '/collage',
      data: {
        arc_id: id,
        collage: img
      },
      success: function() {
        console.log('collage stored in db');
      }
    });
  };
  
  exportImage () {
    html2canvas(document.getElementsByClassName('photoGrid'), {
      onrendered: function(canvas) {
        var theCanvas = canvas;
        theCanvas.style.width = "400px";
        var img = theCanvas.toDataURL("image/png"); 
        this.storeCollage(id, img);     
      }
    });
  };
  
  render () {
    var style = {
      width: "400px"
    }
    return (
      <div style={style} className="photoGrid">
        <ReactRpg imagesArray={this.state.images} columns={[2, 2, 2]} />
      </div>  
    )
  }
};

export default Grid;