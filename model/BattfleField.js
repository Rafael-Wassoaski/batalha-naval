const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/batalha-naval');

const battleFieldSchema = new mongoose.Schema({
	field: [[String]],
	isPostionatedField: Boolean,
	stillPlaying: Boolean
});

const BattleFieldSchema = mongoose.model('battleFields', battleFieldSchema);

module.exports = BattleFieldSchema;
