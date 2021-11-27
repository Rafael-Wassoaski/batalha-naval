const GameSchema = require('../model/Game');

module.exports = class GameController {
	constructor() {
		console.log('Fui criado');
	}
	
	_mountShipOnBattleField(ships, battleField, indexShip) {
		
		if (ships.orientation === 'horizontal') {
			for (let index = ships.column; index <= ships.column + ships.size; index++) {
				battleField[ships.line][index] = indexShip.charAt(0);
			}
			
			return;
		}
		for (let index = ships.line; index <= ships.line + ships.size; index++) {
			battleField[index][ships.column] = indexShip.charAt(0);
		}
	}
	
	_createBattleField(fill) {
		return Array.from(Array(5), () => Array.from(Array(10), () => fill));
	}
	
	async create(req, res) {
		const battleField = this._createBattleField('*');
		const { boats, destroyers, submarines, aircraftcarrier } = req.body;
		const ships = {
			boats,
			destroyers,
			submarines,
			aircraftcarrier,
		};
		try {
			for (let [index, key] of Object.keys(ships).entries()) {
				const ship = ships[key];
				ship.size = index;
				this._mountShipOnBattleField(ships[key], battleField, key);
			}
			
			const game = await GameSchema.create({
				field: battleField,
				isPostionatedField: true,
				stillPlaying: false,
			});
			
			return res.redirect(`/game/play/${ game._id }`);
			
		} catch (e) {
			console.log(e);
			return res.send(e);
		}
		
	}
	
	_generatePlays(games) {
		const humanAverageBattleField = this._createBattleField(0);
		
		for (const game of games) {
			const { field } = game;
			for (const line in field) {
				for (const column in field[line]) {
					field[line][column] !== '*' ? humanAverageBattleField[line][column]++ : null;
				}
			}
		}
		
		const botPlays = [];
		
		for (let index = 0; index < 50; index++) {
			const play = { shotLine: 0, shotColumn: 0 };
			for (const line in humanAverageBattleField) {
				for (const column in humanAverageBattleField[line]) {
					if (humanAverageBattleField[line][column] > humanAverageBattleField[play.shotLine][play.shotColumn]) {
						play.shotLine = line;
						play.shotColumn = column;
					}
				}
			}
			
			humanAverageBattleField[play.shotLine][play.shotColumn] = -1;
			botPlays.push(play);
		}
		
		return botPlays;
	}
	
	_generateBattleField(games) {
		let playersShots = this._createBattleField(0);
		
		for (const game of games) {
			const { field } = game;
			for (const line in field) {
				for (const column in field[line]) {
					String(field[line][column]).includes('*') ? playersShots[line][column]++ : null;
				}
			}
		}
		
		const botShips = this._createBattleField('*');
		const ships = {
			boats: null,
			destroyers: null,
			submarines: null,
			aircraftcarrier: null,
		};
		
		const bestPositions = [];
		
		for (let index = 0; index < 50; index++) {
			const play = { playLine: 0, playColumn: 0 };
			for (const line in playersShots) {
				for (const column in playersShots[line]) {
					
					if (playersShots[line][column] && playersShots[line][column] <= playersShots[play.playLine][play.playColumn]) {
						play.playLine = line;
						play.playColumn = column;
					}
				}
			}
			
			playersShots[play.playLine][play.playColumn] = null;
			bestPositions.push(play);
		}
		
		for (let [index, key] of Object.keys(ships).entries()) {
			let finalPosition;
			for (const position in bestPositions) {
				const { playLine: line, playColumn: column } = bestPositions[position];
				finalPosition = this.checkValidPosition({
					line,
					column,
				}, Number(index), playersShots);
				
				if (finalPosition.orientation) {
					delete bestPositions[position];
					break;
				}
			}
			console.log({ ...finalPosition, size: Number(index) });
			this._mountShipOnBattleField({ ...finalPosition, size: Number(index) }, botShips, key);
			
		}
		
		
		return botShips;
	}
	
	checkValidPosition(position, index, battleField) {
		const { line, column } = position;
		let isUsable = 'horizontal';
		
		const isAlreadyOccupied = function (position) {
			if (['b', 'd', 's', 'a'].includes(position)) {
				//temos algo posicionado aqui já
				isUsable = false;
				return true;
			}
			
			return false;
		};
		
		for (let columnIndex = column; columnIndex < column + index; columnIndex++) {
			if (column + index >= 10) {
				//não adianta pesquisar mais pois o navio não cabe
				isUsable = false;
				break;
			}
			if (isAlreadyOccupied(battleField[line][columnIndex])) {
				break;
			}
		}
		
		if (isUsable) {
			return { line, column, orientation: isUsable };
		}
		
		isUsable = 'vertical';
		for (let lineIndex = line; lineIndex < line + index; lineIndex++) {
			if (line + index >= 5) {
				//não adianta pesquisar mais pois o navio não cabe
				isUsable = false;
				break;
			}
			if (isAlreadyOccupied(battleField[lineIndex][column])) {
				break;
			}
		}
		return { line, column, orientation: isUsable };
	}
	
	async play(req, res) {
		const { gameId } = req.params;
		const shootGames = await GameSchema.find({ _id: { $ne: gameId } });
		const finishedGames = await GameSchema.find({ _id: { $ne: gameId }, stillPlaying: false });
		const humanBattleField = await GameSchema.find({ _id: gameId });
		
		const plays = this._generatePlays(shootGames);
		const botBattleField = this._generateBattleField(finishedGames);
		
		return res.render('play', {humanBattleField: JSON.stringify(humanBattleField), plays: JSON.stringify(plays), botBattleField: JSON.stringify(botBattleField) });
	}
	
	async read(req, res) {
		const { gameId } = req.params;
		
		try {
			const game = await GameSchema.findById(gameId);
			return res.json(game);
			
		} catch (e) {
			console.log(e);
			return res.send(e);
		}
	}
};
