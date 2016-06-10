var db = require('../config.js');
var Blacklist = require('../models/blacklist.js');

var Blacklists = new db.Collection();

Blacklists.model = Blacklist;

module.exports = Blacklists;
