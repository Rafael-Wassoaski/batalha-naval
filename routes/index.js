let express = require('express');
let router = express.Router();
const db = require('../db');
const BattleFieldController = require('../controllers/BattleFieldController');
const battleFieldController = new BattleFieldController();

/* GET home page. */
router.get('/', async function (req, res, next) {
	const battleFields = db.Mongoose.model('battleFields', db.BattleFiedlSchema, 'battleFields');
	
	const data = await battleFields.find({}).lean().exec();
	res.json(data);
});

router.post('/start-game', async (req, res) => {
	battleFieldController.create(req, res);
});

router.post('/play', async function (req, res, next) {
	const battleFields = db.Mongoose.model('battleFields', db.BattleFiedlSchema, 'battleFields');
	const { line, column, gameId } = req.body;
	
	
	const data = await battleFields.find({}).lean().exec();
	res.json(data);
});

module.exports = router;
