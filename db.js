const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/batalha-naval');

module.exports = mongoose;
