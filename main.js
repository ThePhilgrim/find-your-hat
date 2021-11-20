const prompt = require("prompt-sync")({ sigint: true });

const hatChar = "^";
const holeChar = "O";
const fieldChar = "░";
const playerChar = "*";

class Game {
  constructor() {
    this.field = [];
    this.fieldSize = 0;
    this.playerXPosition = 0;
    this.playerYPosition = 0;
  }

  generateField(holePercentage) {
    for (let i = 0; i < this.fieldSize; i++) {
      this.field.push([]);
      for (let j = 0; j < this.fieldSize; j++) {
        this.field[i].push(fieldChar);
      }
    }

    // Put player on field
    this.field[0][0] = playerChar;

    // Put hat on field
    let hatX = 0;
    let hatY = 0;

    // Prevents the hat from spawning on player
    while (hatX === 0 && hatY === 0) {
      hatX = Math.floor(Math.random() * this.fieldSize);
      hatY = Math.floor(Math.random() * this.fieldSize);
    }

    this.field[hatY][hatX] = hatChar;

    // Put holes on the field
    if (holePercentage > 60) {
      holePercentage = 60;
    } else if (holePercentage < 1) {
      holePercentage = 1;
    }

    const numOfHoles = Math.round(holePercentage / 100 * (this.fieldSize * this.fieldSize));

    for (let i = 0; i < numOfHoles; i++) {
      let holeY = Math.floor(Math.random() * this.fieldSize);
      let holeX = Math.floor(Math.random() * this.fieldSize);

      if (this.field[holeY][holeX] === fieldChar && this.pathExists(hatY, hatX)) {
        this.field[holeY][holeX] = holeChar;
      } else {
        i -= 1;
      }
    }
  }

  pathExists(currentY, currentX) {
    let fieldSquaresToCheck = [[currentY, currentX]];
    let fieldSquaresAlreadyChecked = [];

    while (fieldSquaresToCheck.length > 0) {
      console.log(fieldSquaresToCheck.length);
      let newNeighbours = fieldSquaresToCheck.flatMap(fieldSquare => this.getNeighbours(fieldSquare, fieldSquaresToCheck, fieldSquaresAlreadyChecked));

      newNeighbours = Array.from(new Set(newNeighbours.map(JSON.stringify)), JSON.parse);

      fieldSquaresToCheck.forEach(fieldSquare => fieldSquaresAlreadyChecked.push(fieldSquare));
      fieldSquaresToCheck = newNeighbours;

      if (fieldSquaresToCheck.some(array => array[0] === 0 && array[1] === 0)) {
        return true;
      }
    }
    return false;
  }

  getNeighbours([currentY, currentX], fieldSquaresToCheck, fieldSquaresAlreadyChecked) {

    const neighbours = [
      [currentY - 1, currentX],
      [currentY, currentX + 1],
      [currentY + 1, currentX],
      [currentY, currentX - 1]
    ]

    return neighbours.filter(fieldSquare =>
      (fieldSquare[0] >= 0 && fieldSquare[0] < this.fieldSize) &&
      (fieldSquare[1] >= 0 && fieldSquare[1] < this.fieldSize) &&
      (this.field[fieldSquare[0]][fieldSquare[1]] !== "O") &&
      (!fieldSquaresAlreadyChecked.some(array => array[0] === fieldSquare[0] && array[1] === fieldSquare[1])) &&
      (!fieldSquaresToCheck.some(array => array[0] === fieldSquare[0] && array[1] === fieldSquare[1])));
  }

  getCurrentBoardState() {
    return this.field.map(row => row.join("")).join("\n");
  }

  changePlayerPosition(event) {
    console.clear();
    event = event.toLowerCase();

    if (event === "a") {
      this.playerXPosition -= 1;
    } else if (event === "d") {
      this.playerXPosition += 1;
    }

    if (event === "w") {
      this.playerYPosition -= 1;
    } else if (event === "s") {
      this.playerYPosition += 1;
    }

    if (!this.getGameStatus()) {
      if (event === "a" || event === "d" || event === "w" || event === "s") {
        this.field[this.playerYPosition][this.playerXPosition] = playerChar;
      } else {
        console.log("Please use the WASD buttons to control your character.")
      }
      console.log(this.getCurrentBoardState());
    }
  }

  getGameStatus() {
    if (
      this.playerYPosition >= this.field.length ||
      this.playerYPosition < 0 ||
      this.playerXPosition >= this.field[this.playerYPosition].length ||
      this.playerXPosition < 0
    ) {
      return "GAME LOST: You fell off the edge of the world.";
    } else if (this.field[this.playerYPosition][this.playerXPosition] === holeChar) {
      return "GAME LOST: You walked into a hole.";
    } else if (this.field[this.playerYPosition][this.playerXPosition] === hatChar) {
      return "GAME WON: Congratulations! You found your hat!"
    }

    return null;
  }

  startGame() {

    console.log("Welcome to Find Your Hat!")

    this.fieldSize = prompt("How wide/high do you want the field to be? (Enter a number between 5-30): ");

    const holePercentage = prompt(`How many percent do you want to be covered in holes? (Enter a number between 1-60): `);

    this.generateField(holePercentage);

    console.log(`Wonderful! Use your WASD buttons to move your character (${playerChar}) to the hat (${hatChar}).`);
    console.log("Let's Start!");

    console.log(this.getCurrentBoardState());

    while (true) {
      const gameOverReason = this.getGameStatus();

      if (gameOverReason !== null) {
        console.log(gameOverReason);
        break;
      }

      let currentMove = prompt('');
      this.changePlayerPosition(currentMove);

    }
  }
}


const myGame = new Game();

myGame.startGame();
