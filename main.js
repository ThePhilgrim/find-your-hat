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
    this.gameLost = false;
  }

  getCurrentBoardState() {
    this.field.map(row => row.join("")).join("\n");
  }

  changePlayerPosition(event) {
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

    if (!this.gameLost()) {
      // TODO: Insert player indicator in new spot here
    }
  }

  gameLost() {
    //Check if character is outside field
    if (
      this.playerYPosition >= this.field.length ||
      this.playerYPosition < 0 ||
      this.playerXPosition >= this.field[this.playerYPosition].length ||
      this.playerXPosition < 0
    ) {
      this.gameLost = true;
    }

    // Check if character walked into a hole
    if (this.field[this.playerYPosition][this.playerXPosition] === "O") {
      this.gameLost = true;
    }
  }
}

const myField = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["░", "^", "░"],
]);

myField.getCurrentBoardState();

/*
EXAMPLE FIELD:

*░O░░░░^░░
░O░░░OO░OO
░░OO░░░O░░
O░░░OO░░░░
░░O░░░░O░░
*/
