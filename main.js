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
    console.log("Event: " + event);

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

    console.log("X: " + this.playerXPosition);
    console.log("Y: " + this.playerYPosition);

    if (!this.checkIfGameIsLost(true)) {
      if (event === "a" || event === "d" || event === "w" || event === "s") {
        this.field[this.playerYPosition][this.playerXPosition] = "*";
      } else {
        console.log("Please use the WASD buttons to control your character.")
      }
      console.log(this.getCurrentBoardState());
    }
  }

  checkIfGameIsLost(fromPlayerPosFunc = false) {
    //Check if character is outside field
    if (
      this.playerYPosition >= this.field.length ||
      this.playerYPosition < 0 ||
      this.playerXPosition >= this.field[this.playerYPosition].length ||
      this.playerXPosition < 0
    ) {
      if (fromPlayerPosFunc) {
        console.log("GAME LOST: You fell off the edge of the world.")
      }
      return true;
    }

    // Check if character walked into a hole
    if (this.field[this.playerYPosition][this.playerXPosition] === "O") {
      if (fromPlayerPosFunc) {
        console.log("GAME LOST: You walked into a hole.")
      }
      return true;
    }

    return false;
  }

  startGame() {
    console.log("Welcome to Find Your Hat – Use your WASD buttons to move your character (\'*\') to the hat (\'^\').");
    console.log("Let's Start!");
    console.log("X: " + this.playerXPosition);
    console.log("Y: " + this.playerYPosition);
    console.log(this.getCurrentBoardState());

    while (!this.checkIfGameIsLost()) {
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

// console.log(myField.getCurrentBoardState());

/*
EXAMPLE FIELD:

*░O░░░░^░░
░O░░░OO░OO
░░OO░░░O░░
O░░░OO░░░░
░░O░░░░O░░
*/
