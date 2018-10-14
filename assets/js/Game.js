class Game {
	constructor(difficulty) {
		if (difficulty === "easy") {
			this.minefield = this.buildMinefield(5);
			this.plantBomb(3);			
		} else if (difficulty === "hard") {
			this.minefield = this.buildMinefield(10);
			this.plantBomb(10);
		}
	}

	buildMinefield(width) {
		let minefield = [];
		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j= 0; j < width; j++) {
				column.push(0);
			}
			minefield.push(column);
		}
		return minefield;
	}

	plantBomb(numBombs) {
		let max = this.minefield.length - 1;
		let min = 0;
		for (let i = 0; i < numBombs; i++) {
			// pick random number between min and max (inclusive)
			let rngRow = Math.floor(Math.random() * (max - min + 1) + min);
			let rngColumn = Math.floor(Math.random() * (max - min + 1) + min);

			// place mine
			if (this.minefield[rngRow][rngColumn] < 1000) {
				this.minefield[rngRow][rngColumn] = 1000;

				// place markers
				if (rngRow > 0) {
					this.minefield[rngRow - 1][rngColumn]++;				// top
					if (rngColumn > 0) {
						this.minefield[rngRow - 1][rngColumn - 1]++;		// top left
					}
					if (rngColumn < max) {
						this.minefield[rngRow - 1][rngColumn + 1]++;		// top right	
					}
				}

				if (rngColumn > 0) {
					this.minefield[rngRow][rngColumn - 1]++;				// left
				}
				
				if (rngColumn < max) {
					this.minefield[rngRow][rngColumn + 1]++;				// right
				}

				if (rngRow < max) {
					this.minefield[rngRow + 1][rngColumn]++;				// bottom
					if (rngColumn > 0) {
						this.minefield[rngRow + 1][rngColumn - 1]++;		// bottom left
					}
					if (rngColumn < max) {
						this.minefield[rngRow + 1][rngColumn + 1]++;		// bottom right
					}
				}
			}
		}
	}

	displayMatrix() {
		let markup = "";
		for (let i = 0; i < this.minefield.length; i++) {
			markup += `<tr id="row${i}">\n`;
			for (let j = 0; j < this.minefield.length; j++) {
				markup += `<td id="col${j}">${this.minefield[i][j]}</td>`;
			}
			markup += "\n</tr>\n";
		}
		return markup;
	}

	displayHiddenMatrix() {
		let markup = "";
		for (let i = 0; i < this.minefield.length; i++) {
			markup += `<tr id="row${i}">\n`;
			for (let j = 0; j < this.minefield.length; j++) {
				markup += `<td id="col${j}"></td>`;
			}
			markup += "\n</tr>\n";
		}
		return markup;
	}

	getValue(row, col) {
		return this.minefield[row][col];
	}

	getMinefieldSize() {
		return this.minefield.length;
	}

	/**
	 * Get relative value in matrix including row and column index
	 * @param object value, row, column
	 * @param direction String top, bottom, left, right
	 * @return object with value, row, column
	 */

	getRelativeCellObject(currentCell, direction) {
		direction = direction.toLowerCase();
		let row = currentCell.row;
		let col = currentCell.col;
		let relativeRow = row;
		let relativeCol = col;

		// get top cell
		if (direction === "top" && row > 0) {
			relativeRow--;
		}

		// get bottom cell
		if (direction === "bottom" && row < this.minefield.length - 1) {
			relativeRow++;
		}

		// get left cell
		if (direction === "left" && col > 0) {
			relativeCol--;
		}

		// get right cell
		if (direction === "right" && col < this.minefield.length - 1) {
			relativeCol++;
		}

		// if top, bottom, left cell is same as currentCell then return false
		if (row === relativeRow && col === relativeCol) {
			return false;
		} 

		return {value: this.minefield[relativeRow][relativeCol], row: relativeRow, col: relativeCol}
	}

	findEmptyNeighbors(currentCell) {
		let emptyNeighbors = [];
		let neighborhood = [
			this.getRelativeCellObject(currentCell, "top"),
			this.getRelativeCellObject(currentCell, "bottom"),
			this.getRelativeCellObject(currentCell, "left"),
			this.getRelativeCellObject(currentCell, "right")
		]
	
		neighborhood.forEach(function(neighbor){
			if (neighbor && neighbor.value === 0) {
				emptyNeighbors.push(neighbor);
			}
		});
	
		return emptyNeighbors;
	}
}