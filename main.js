const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.playerXPosition = 0;
    this.playerYPosition = 0;
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

    if (!this.checkIfGameIsLost()) {
      if (event === "a" || event === "d" || event === "w" || event === "s") {
        this.field[this.playerYPosition][this.playerXPosition] = "*";
      } else {
        console.log("Please use the WASD buttons to control your character.")
      }
      console.log(this.getCurrentBoardState());
    }
  }

  checkIfGameIsLost() {
    if (
      this.playerYPosition >= this.field.length ||
      this.playerYPosition < 0 ||
      this.playerXPosition >= this.field[this.playerYPosition].length ||
      this.playerXPosition < 0
    ) {
      return "GAME LOST: You fell off the edge of the world.";
    }

    if (this.field[this.playerYPosition][this.playerXPosition] === "O") {
      return "GAME LOST: You walked into a hole.";
    }

    return null;
  }

  startGame() {
    console.log("Welcome to Find Your Hat – Use your WASD buttons to move your character (\'*\') to the hat (\'^\').");
    console.log("Let's Start!");
    console.log(this.getCurrentBoardState());

    while (true) {
      const gameOverReason = this.checkIfGameIsLost();

      if (gameOverReason !== null) {
        console.log(gameOverReason);
        break;
      } else if (this.field[this.playerYPosition][this.playerXPosition] === "^") {
        console.log("GAME WON: Congratulations! You found your hat!");
        break;
      }

      let currentMove = prompt('');
      this.changePlayerPosition(currentMove);

    }
  }
}

const myField = new Field([
  ["*", "░", "░", "░", "░", "░", "░"],
  ["░", "░", "░", "░", "░", "░", "░"],
  ["░", "░", "░", "░", "O", "░", "░"],
  ["░", "░", "O", "░", "░", "░", "░"],
  ["░", "░", "░", "░", "░", "O", "░"],
  ["░", "░", "░", "░", "░", "░", "░"],
  ["░", "░", "░", "░", "░", "^", "░"],
]);

myField.startGame();