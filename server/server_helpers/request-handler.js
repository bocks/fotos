var bodyParser = require('body-parser');
var path = require('path');
var bluebird = require('bluebird');
var url = require('url');
var _ = require('underscore');
var db = require('../db/config.js');
var Users = require('../db/collections/users');
var User = require('../db/models/user');

var Arc = require('../db/models/arc');
var Arcs = require('../db/collections/arcs');

var Image = require('../db/models/image.js');
var Images = require('../db/collections/images.js');

var Blacklist = require('../db/models/blacklist');
var Blacklists = require('../db/collections/blacklists');

var Collage = require('./collager');

var limit = 4;

module.exports.main = {
  get: function (req, res) {
    res.redirect('/signin');
  }
};

module.exports.signin = {
  get: function (req, res) {
    res.sendFile(path.normalize(__dirname + '/../../public/index.html'));
  },

  post: function (req, res) {
    Users.reset()
      .query({where: {fbId: req.body.userId}})
      .fetch()
      .then(function (allUsers) {
        if (allUsers.length > 0) {
          // this needs to update database and not just console log
          console.log('This username, ' + req.body.userId + ' already exists in the database');
        } else {
          new User({name: req.body.name, fbId: req.body.userId, access_token: req.body.access_token})
          .save()
          .then(function(data){
            // console.log('user should have saved', data);
          });
        }
        res.writeHead(201);
        res.end();
      });
  }
};

// take an array and return arr selecting only =limit # of elements
var minimizeAndRandArr = function (arr, targetLength, callback) {
  var totalLen = arr.length;
  var count = 0;
  var results = [];

  Blacklist.fetchAll()
   .then( function(res) {

      // collect all the blocked urls
      var blockedURLs = res.models.map( function(URL) {
        return URL.attributes.url;
      });

      while (arr.length > 0) {
        var ind = Math.floor(Math.random() * arr.length);

        // check blacklisted status before adding to results
        if (!_.contains(blockedURLs, arr[ind].images[0].source)) {
          results.push(arr[ind]);
          count += 1;
        }
        arr.splice(ind, 1);

        if (arr.length === 0 || count === targetLength) {
          callback(results);
          return;
        }
      }
    });
}

module.exports.create = {
  get: function (req, res) {
    res.send('success');
  },

  post: function (req, res) {
    // store obj from fb api calls into db
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    var callback = function(results) {
      var collageArray = [];

      for (var i = 0; i < results.length; i++) {
        if (results[i]) {
          collageArray.push(results[i].images[0].source);
        }
      }

      // fetch the current user to grab id for foreign key
      User.forge({fbId: req.body.id})
        .fetch()
        .then(function (userMatched) {
          // make new arc
          var arc = new Arc({
            name: Date()
          });
          return arc.save({
            user_id: userMatched.id,
            query_start_date: startDate,
            query_end_date: endDate
          });
        })
        .then(function (newArc) {
          // console.log('Images in arc =>', results);
          Collage.collagify(collageArray, newArc.id);

          // store img into new arc
          for (var imgId = 0; imgId < results.length; imgId++) {
            var imgSizeArr = results[imgId].images;
              var img = imgSizeArr[0];
              var image = new Image({
                height: img.height,
                width: img.width,
                url: img.source
              });
              image.save({arc_id: newArc.id});
          }
          res.send('success');
        });
      }

      minimizeAndRandArr(req.body.photos.data, limit, callback);
    }
}

module.exports.dashboard = {
	get: function(req, res) {
		var url_parts = url.parse(req.url, true);
		var userId = url_parts.query.user_id;
    var results = [];

    User.forge({fbId: userId})
      .fetch()
      .then(function (userMatched) {
        Arcs.reset()
          .query({where: {user_id: userMatched.id}})
          .fetch()
          .then(function (arcMatched) {
              (function next(index) {
                if (index === arcMatched.length) {
                	res.json(results);
                	return;
                }
                Images.reset()
                  .query(function (qb) {
                    qb.where('arc_id', '=', arcMatched.models[index].id);
                  })
                  .fetch()
                  .then(function (imageMatched) {

                    // loop through all images in each arc
                    result = [];
                    for (var img = 0; img < imageMatched.length; img++) {
                      result.unshift({
                        thumbnail: imageMatched.models[img].attributes.url,
                        src: imageMatched.models[img].attributes.url,
                        arcId: imageMatched.models[img].attributes.arc_id,
                        startDate: arcMatched.models[index].attributes.query_start_date,
                        endDate: arcMatched.models[index].attributes.query_end_date,
                        userId: arcMatched.models[index].attributes.user_id
                      });
                    }
                    results.push(result);
                    next(index + 1);
                  });
              }) (0);
            });
          })
    },

    delete: function(req, res) {
      var arcId = req.body.arcId;

      Images.reset()
        .query({where: {arc_id: arcId}})
        .fetch()
        .then(function(images) {

          images.models.forEach(function(image) {
            Image.forge({id: image.id})
              .fetch()
              .then(function(img) {
                img.destroy();
              });
          });
        })
        .then(function() {
          Arc.forge({id: arcId})
            .fetch()
            .then(function(arc) {
              arc.destroy()
              .then(function() {
                Collage.delete(arcId);
                res.send('Delete worked.');
              });
            });
        });
      },

    // TODO: check that this still works
    post: function(req, res) {
        var arcId = req.body.arcId;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;

        minimizeAndRandArr(req.body.photos.data, limit, function(imgUrl) {
          console.log('in minAndRand------>', imgUrl);


          Arc.forge({id: arcId})
            .fetch()
            .then( function(arc) {

              var dates = {
                query_start_date: startDate,
                query_end_date: endDate
              };

              arc.save(dates, {patch: true});
            })

          Images.reset()
            .query({where: {arc_id: arcId}})
            .fetch()
            .then(function (images) {
              var collageArray = [];

              for (var i = 0; i < imgUrl.length; i++) {
                if (imgUrl[i]) {
                  collageArray.push(imgUrl[i].images[0].source);
                }
              }

              Collage.collagify(collageArray, arcId);

                for (var imgId = 0; imgId < imgUrl.length; imgId++) {
                  var imgSizeArr = imgUrl[imgId].images;
                    var img = imgSizeArr[0];


                    var image = {
                      height: img.height,
                      width: img.width,
                      url: img.source
                    };

                    new Image({id: images.models[imgId].id})
                      .save(image, {patch: true})
                      .then(function(image) {
                        console.log('imgs has been updated => ', image);
                      });

                  }
                });
            res.send('success');
        });
    },

    // TODO: check for duplicates in blacklist table
    swap: function(req, res) {

      // blacklist this image
      var blacklist = new Blacklist();

      blacklist.save({
        user_id: req.body.userId,
        url: req.body.imageUrl
      })
      .then( function() {
        // console.log('saved blacklisted item to db', req.body);

        minimizeAndRandArr(req.body.photos.data, 1, function(result) {
          var replacement = result[0].images[0];
          var newImage = {
            height: replacement.height,
            width: replacement.width,
            url: replacement.source
          };

          Images.reset()
            .query({where: {url: req.body.imageUrl}})
            .fetch()
            .then(function(toReplace) {
              // console.log('replacement id----->', toReplace.models[0].id);

              new Image({ id: toReplace.models[0].id })
                .save(newImage, {patch: true})
                .then(function(newImage) {
                  // console.log('imgs has been updated => ', newImage);
                  res.end();
                });

            });
        });
      });
    }
};
