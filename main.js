/* eslint-disable no-console */
/* eslint-disable max-len */
const prompt = require('prompt-sync')({ sigint: true });

const hatChar = '^';
const holeChar = 'O';
const fieldChar = '░';
const playerChar = '*';

class Game {
  constructor() {
    this.field = [];
    this.fieldSize = 0;
    this.holePercentage = 0;
    this.playerXPosition = 0;
    this.playerYPosition = 0;
  }

  generateField() {
    for (let i = 0; i < this.fieldSize; i += 1) {
      this.field.push([]);
      for (let j = 0; j < this.fieldSize; j += 1) {
        this.field[i].push(fieldChar);
      }
    }

    // Put player on field
    this.field[0][0] = playerChar;

    // Put hat on field
    let hatX;
    let hatY;

    // Prevents the hat from spawning on player
    do {
      hatX = Math.floor(Math.random() * this.fieldSize);
      hatY = Math.floor(Math.random() * this.fieldSize);
    } while (hatX === 0 && hatY === 0);

    this.field[hatY][hatX] = hatChar;

    // Put holes on the field
    if (this.holePercentage > 60) {
      this.holePercentage = 60;
    } else if (this.holePercentage < 1) {
      this.holePercentage = 1;
    }

    const numOfHoles = Math.round((this.holePercentage / 100) * (this.fieldSize * this.fieldSize));
    let placeHolesAttempts = 0;
    // let lastPlacedHole;

    for (let i = 0; i < numOfHoles; i += 1) {
      const holeY = Math.floor(Math.random() * this.fieldSize);
      const holeX = Math.floor(Math.random() * this.fieldSize);

      if (placeHolesAttempts < 100 && this.field[holeY][holeX] === fieldChar) {
        this.field[holeY][holeX] = holeChar;

        if (!this.pathExists(hatY, hatX)) {
          this.field[holeY][holeX] = fieldChar;
          placeHolesAttempts += 1;
          i -= 1;
        }
      }
    }
  }

  pathExists(currentY, currentX) {
    let fieldSquaresToCheck = [[currentY, currentX]];
    const fieldSquaresAlreadyChecked = [];

    while (fieldSquaresToCheck.length > 0) {
      fieldSquaresToCheck.forEach((fieldSquare) => fieldSquaresAlreadyChecked.push(fieldSquare));

      // eslint-disable-next-line no-loop-func
      let newNeighbours = fieldSquaresToCheck.flatMap((fieldSquare) => this.getNeighbours(fieldSquare, fieldSquaresToCheck, fieldSquaresAlreadyChecked));

      newNeighbours = Array.from(new Set(newNeighbours.map(JSON.stringify)), JSON.parse);

      fieldSquaresToCheck = newNeighbours;

      if (fieldSquaresToCheck.some((array) => array[0] === 0 && array[1] === 0)) {
        return true;
      }
    }
    return false;
  }

  getNeighbours([currentY, currentX], fieldSquaresAlreadyChecked) {
    const neighbours = [
      [currentY - 1, currentX],
      [currentY, currentX + 1],
      [currentY + 1, currentX],
      [currentY, currentX - 1]];

    return neighbours.filter((fieldSquare) => (fieldSquare[0] >= 0 && fieldSquare[0] < this.fieldSize)
      && (fieldSquare[1] >= 0 && fieldSquare[1] < this.fieldSize)
      && (this.field[fieldSquare[0]][fieldSquare[1]] !== 'O')
      && (!fieldSquaresAlreadyChecked.some((array) => array[0] === fieldSquare[0] && array[1] === fieldSquare[1])));
  }

  getCurrentBoardState() {
    return this.field.map((row) => row.join('')).join('\n');
  }

  // eslint-disable no-param-reassign
  changePlayerPosition(event) {
    console.clear();

    if (event.toLowerCase() === 'a') {
      this.playerXPosition -= 1;
    } else if (event.toLowerCase() === 'd') {
      this.playerXPosition += 1;
    }

    if (event.toLowerCase() === 'w') {
      this.playerYPosition -= 1;
    } else if (event.toLowerCase() === 's') {
      this.playerYPosition += 1;
    }

    if (!this.getGameStatus()) {
      if (event === 'a' || event === 'd' || event === 'w' || event === 's') {
        this.field[this.playerYPosition][this.playerXPosition] = playerChar;
      } else {
        console.log('Please use the WASD buttons to control your character.');
      }
      console.log(this.getCurrentBoardState());
    }
  }

  getGameStatus() {
    if (
      this.playerYPosition >= this.field.length
      || this.playerYPosition < 0
      || this.playerXPosition >= this.field[this.playerYPosition].length
      || this.playerXPosition < 0
    ) {
      return 'GAME LOST: You fell off the edge of the world.';
    }

    if (this.field[this.playerYPosition][this.playerXPosition] === holeChar) {
      return 'GAME LOST: You walked into a hole.';
    }

    if (this.field[this.playerYPosition][this.playerXPosition] === hatChar) {
      return 'GAME WON: Congratulations! You found your hat!';
    }

    return null;
  }

  startGame() {
    console.log('Welcome to Find Your Hat!');

    this.fieldSize = Number(prompt('How wide/high do you want the field to be? (Enter a number between 5-30): '));

    this.holePercentage = Number(prompt('How many percent do you want to be covered in holes? (Enter a number between 1-60): '));

    this.generateField();

    console.log(`Wonderful! Use your WASD buttons to move your character (${playerChar}) to the hat (${hatChar}).`);
    console.log("Let's Start!");

    console.log(this.getCurrentBoardState());
    /* eslint no-constant-condition: ["error", { "checkLoops": false }] */
    while (true) {
      const gameOverReason = this.getGameStatus();

      if (gameOverReason !== null) {
        console.log(gameOverReason);
        break;
      }

      const currentMove = prompt('');
      this.changePlayerPosition(currentMove);
    }
  }
}

const myGame = new Game();

myGame.startGame();
