const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.playerXPosition = 0;
    this.playerYPosition = 0;
    this.gameLost = false;
  }

  getCurrentBoardState() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(''));
    }
  }

  changePlayerPosition(event) {
    event = event.toLowerCase();

    // Change playerXPosition
    if (event === 'a') {
      this.playerXPosition -= 1;
    } else if (event === 'd') {
      this.playerXPosition += 1;
    }

    // Change playerYPosition
    if (event === 'w') {
      this.playerYPosition -= 1;
    } else if (event === 's') {
      this.playerYPosition += 1;
    }

    this.checkIfGameLost();
  }

  checkIfGameLost(event) {
    //Check if character moves outside field
    if ()
  }

}




const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
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
