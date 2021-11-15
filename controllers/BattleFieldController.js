const BattleFieldSchema = require('../model/BattfleField');

module.exports = class BattleFieldController {
	constructor() {
		console.log('Fui criado');
	}
	
	_mountShipOnBattleField(ships, battleField, indexShip) {
		if (Array.isArray(ships)) {
			for (const ship of ships) {
				if (ship.orientation === 'horizontal') {
					for (let index = ship.column; index < ship.size; index++) {
						battleField[ship.line][index] = indexShip;
					}
				} else if (ship.orientation === 'vertical') {
					for (let index = ship.line; index < ship.size; index++) {
						battleField[index][ship.column] = indexShip;
					}
				}
			}
		}
	}
	
	_createBattleField() {
		const array = Array(5);
		const innerArray = Array(10);
		innerArray.fill('*');
		array.fill(innerArray);
		
		return array;
	}
	
	async create(req, res) {
		const battleField = this._createBattleField();
		const { boats, destroyers, submarines, aircraftCarrier } = req.body;
		const ships = {
			boats,
			destroyers,
			submarines,
			aircraftCarrier,
		};
		try {
			for (let ship in Object.keys(ships)) {
				this._mountShipOnBattleField(ships[ship], battleField, ship);
			}
			
			const gameData = {
				field: battleField,
				isPostionatedField: true,
				stillPlaying: false,
			};
			
			const game = await BattleFieldSchema.create(gameData, console.log);
			
			console.log(game);
			return res.send(game);
			
		} catch (e) {
			console.log(e);
			return res.send(e);
		}

	}
};
