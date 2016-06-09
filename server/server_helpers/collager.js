var createCollage = require('photo-collage');
var fs = require('fs');

module.exports = {

  collagify: function (arr, arcId) {
    var options = {
      sources: arr,
      width: 2,
      height: 2,
      imageWidth: 1080,
      imageHeight: 1080,
      spacing: 0
    };

    createCollage(options)
      .then(function (canvas) {
        var src = canvas.jpegStream();
        var dest = fs.createWriteStream('public/collages/collage-' + arcId + '.jpeg');
        src.pipe(dest);
      })
    ;
  }
};