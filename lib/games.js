import {check} from 'meteor/check';
import {gameLogic} from './gameLogic';
import {Constants, GameStatus} from './constants';
import {Games} from './collections';

Meteor.methods({
    "games.create"() {
        gameLogic.newGame();
    },

    "games.giveUp"() {
        const game = Games.findOne(
            {
                $and: [{status: {$ne: GameStatus.WAITING}}, {
                    $or: [
                        {player1: this.userId},
                        {player2: this.userId}]
                }]
            });

        if (game !== undefined) {
            if (game.status !== GameStatus.WAITING && game.status !== GameStatus.END) {
                if (game.player1 === this.userId) {
                    gameLogic.setGameResult(game._id, game.player2);
                    gameLogic.removePlayer(game._id, "player1");
                } else if (game.player2 === this.userId) {
                    gameLogic.setGameResult(game._id, game.player1);
                    gameLogic.removePlayer(game._id, "player2");
                }
            } else {
                if (game.player1 === "" || game.player2 === "") {
                    gameLogic.removeGame(game._id);
                } else {
                    if (game.player1 === this.userId)
                        gameLogic.removePlayer(game._id, "player1");
                    else if (game.player2 === this.userId)
                        gameLogic.removePlayer(game._id, "player2");
                }
            }
        }
    },

    "games.join"() {
        const game = Games.findOne({status: GameStatus.WAITING});
        if (game === undefined) {

        } else if (game !== undefined && game.player1 !== this.userId && game.player2 === "") {
            gameLogic.joinGame(game);
        }
    },

    "games.hint"() {
        let game = Games.findOne({status: this.userId});
        if (game !== undefined) {
            return gameLogic.hint(game, this.userId);
        }
        return undefined;
    },

    "games.makeMove"(positionX, positionY) {
        check(positionX, String);
        check(positionY, String);

        gameLogic.validatePosition(positionX, positionY);

        let game = Games.findOne({status: this.userId});

        if (game !== undefined) {
            gameLogic.addNewMove(positionX, positionY);

            if (gameLogic.checkIfGameWasWon(positionX, positionY)) {
                gameLogic.setGameResult(game._id, this.userId);
            } else {
                if (game.moves.length === Constants.BOARD_LENGTH * Constants.BOARD_LENGTH) {
                    gameLogic.setGameResult(game._id, GameStatus.DRAW);
                } else {
                    gameLogic.updateTurn(game);
                }
            }
        }
    },
});