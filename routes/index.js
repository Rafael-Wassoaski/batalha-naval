let express = require('express');
let router = express.Router();
const db = require('../db');
const GameController = require('../controllers/GameController');
const gameController = new GameController();

/* GET home page. */
router.get('/', async function (req, res, next) {
	let ship = 0;
	const shipsName = [
		'Boats',
		'Destroyers',
		'Submarines',
		'Aircraft Carrier']
	;
	let orientation = 'horizontal';//false horizontal vertical vertical
	
	res.render('positionate', { ship, shipsName, orientation });
});

router.get('/:gameId', async (req, res) => {
	gameController.read(req, res);
});

router.post('/start-game', async (req, res) => {
	gameController.create(req, res);
});

router.get('/play/:gameId',async(req, res)=>{
	gameController.play(req, res);
} )


module.exports = router;
