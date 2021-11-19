const prompt = require("prompt-sync")({ sigint: true });

const hatChar = "^";
const holeChar = "O";
const fieldChar = "░";
const playerChar = "*";

class Game {
  constructor() {
    this.field = [];
    this.playerXPosition = 0;
    this.playerYPosition = 0;
  }

  generateField(fieldSize, holePercentage) {
    for (let i = 0; i < fieldSize; i++) {
      this.field.push([]);
      for (let j = 0; j < fieldSize; j++) {
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
      hatX = Math.floor(Math.random() * fieldSize);
      hatY = Math.floor(Math.random() * fieldSize);
    }

    this.field[hatY][hatX] = hatChar;

    // Put holes on the field
    if (holePercentage > 60) {
      holePercentage = 60;
    } else if (holePercentage < 1) {
      holePercentage = 1;
    }

    const numOfHoles = Math.round(holePercentage / 100 * (fieldSize * fieldSize));

    for (let i = 0; i <= numOfHoles; i++) {
      while (true) {
        let holeX = Math.floor(Math.random() * fieldSize);
        let holeY = Math.floor(Math.random() * fieldSize);

        if (this.field[holeY][holeX] !== playerChar && this.field[holeY][holeX] !== hatChar) {
          this.field[holeY][holeX] = holeChar;
        }

        if (!this.pathExists(fieldSize, hatX, hatY)) {
          this.field[holeY][holeX] = fieldChar;
          i -= 1;
        }
      }
    }
  }

  pathExists(fieldSize, currentX, currentY) {
    fieldSquaresToCheck = [];
    fieldSquaresAlreadyChecked = [];

    let neighbours = getNeighbours(fieldSize, [currentX, currentY], fieldSquaresAlreadyChecked);

    neighbours.forEach(neighbour => fieldSquaresToCheck.push(neighbour));

    while (fieldSquaresToCheck) {
      let newNeighbours = fieldSquaresToCheck.flatMap(fieldSquare => getNeighbours(fieldSize, fieldSquare, fieldSquaresAlreadyChecked));

      fieldSquaresToCheck.forEach(fieldSquare => fieldSquaresAlreadyChecked.push(fieldSquare));
      fieldSquaresToCheck = newNeighbours;
    }
  }

  getNeighbours(fieldSize, [currentX, currentY], fieldSquaresAlreadyChecked) {
    const neighbours = [
      [currentY - 1, currentX],
      [currentY, currentX + 1],
      [currentY + 1, currentX],
      [currentY, currentX - 1]
    ]

    return neighbours.filter(fieldSquare =>
      (fieldSquare[0] >= 0 && fieldSquare[0] < fieldSize) &&
      (fieldSquare[1] >= 0 && fieldSquare[1] < fieldSize) &&
      (this.field[fieldSquare[0]][fieldSquare[1]] !== "O") &&
      (!fieldSquaresAlreadyChecked.some(array => array[0] === fieldSquare[0] && array[1] === fieldSquare[1])))
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

    const fieldSize = prompt("How wide/high do you want the field to be? (Enter a number between 5-30): ");

    const holePercentage = prompt(`Great, the field will be ${fieldSize}x${fieldSize}. How many percent do you want to be covered in holes? (Enter a number between 1-60): `);

    this.generateField(fieldSize, holePercentage);

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

// const myGame = new Game([
//   ["*", "░", "░", "░", "░", "░", "░"],
//   ["░", "░", "░", "░", "░", "░", "░"],
//   ["░", "░", "░", "░", "O", "░", "░"],
//   ["░", "░", "O", "░", "░", "░", "░"],
//   ["░", "░", "░", "░", "░", "O", "░"],
//   ["░", "░", "░", "░", "░", "░", "░"],
//   ["░", "░", "░", "░", "░", "^", "░"],
// ]);