import {check} from 'meteor/check';
import {gameLogic} from './gameLogic';
import Constants from './constants';
import {Games} from './collections';

Meteor.methods({
    "games.play"() {
        const game = Games.findOne({status: "waiting"});

        if (game === undefined) {
            gameLogic.newGame();
        } else if (game !== undefined && game.player1 !== this.userId && game.player2 === "") {
            gameLogic.joinGame(game);
        }
    },

    "games.makeMove"(positionX, positionY) {
        check(positionX, String);
        check(positionY, String);

        gameLogic.validatePosition(positionX, positionY);

        let game = Games.findOne({status: this.userId});

        if (game !== undefined) {
            gameLogic.addNewMove(positionX, positionY);

            if (gameLogic.checkIfGameWasWon()) {
                gameLogic.setGameResult(game._id, this.userId);
            } else {
                if (game.moves.length === Constants.BOARD_LENGTH * Constants.BOARD_LENGTH) {
                    gameLogic.setGameResult(game._id, "tie");
                } else {
                    gameLogic.updateTurn(game);
                }
            }
        }
    }
});