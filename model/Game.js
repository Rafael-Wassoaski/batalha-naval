const mongoose = require('../db');

const gameSchema = new mongoose.Schema({
	field: [[String]],
	isPostionatedField: Boolean,
	stillPlaying: Boolean
});

const GameSchema = mongoose.model('game', gameSchema);

module.exports = GameSchema;
