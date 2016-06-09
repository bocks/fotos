var createCollage = require('photo-collage');
var fs = require('fs');

var options = {
  sources: [
    'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx',
    'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
    'http://cdn.grumpycats.com/wp-content/uploads/2016/02/12654647_974282002607537_7798179861389974677_n-758x758.jpg',
    'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-breed-landing-hero.ashx'
  ],
  width: 2,
  height: 2,
  imageWidth: 1080,
  imageHeight: 1080,
  spacing: 0
};

createCollage(options)
  .then(function (canvas) {
    var src = canvas.jpegStream();
    var dest = fs.createWriteStream("testImage");
    src.pipe(dest);
  })
;