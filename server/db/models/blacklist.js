var db = require('../config.js');
require('./user');

var Blacklist = db.Model.extend({
  tableName: 'blacklist',

  user: function () {
    return this.belongsTo('User', 'user_id');
  }
});

module.exports = db.model('Blacklist', Blacklist);
