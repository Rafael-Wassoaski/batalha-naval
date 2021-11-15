const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/batalha-naval');

module.exports = {Mongoose: mongoose};
