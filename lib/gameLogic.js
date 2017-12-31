import {Constants, GameStatus} from "../lib/constants";
import {Games} from "../lib/collections";
import {WinRules, WinCounts} from "./constants";

class GameLogic {
    newGame() {
        if (!this.userIsAlreadyPlaying()) {
            Games.insert({
                player1: Meteor.userId(),
                player2: "",
                moves: [],
                status: GameStatus.WAITING,
                result: "",
                winCounter: [{"playerID": Meteor.userId(), "winCounts": WinCounts}]
            });
        }
    }

    userIsAlreadyPlaying() {
        const game = Games.findOne({
            $or: [
                {player1: Meteor.userId()},
                {player2: Meteor.userId()}]
        });

        if (game !== undefined)
            return true;

        return false;
    }

    joinGame(game) {
        if (game.player2 === "" && Meteor.userId() !== undefined) {
            Games.update(
                {_id: game._id},
                {
                    $set: {
                        player2: Meteor.userId(),
                        status: game.player1,},
                    $push: {
                        winCounter: {playerID: Meteor.userId(), winCounts: WinCounts}
                    }
                }
            );
        }
    }

    validatePosition(positionX, positionY) {
        for (let x = 0; x < Constants.BOARD_LENGTH; x++) {
            for (let y = 0; y < Constants.BOARD_LENGTH; y++) {
                if (positionX == x && positionY == y)
                    return true;
            }
        }

        throw new Meteor.Error('invalid-position', "Selected position does not exist... please stop trying to hack the game!!");
    }

    addNewMove(positionX, positionY) {
        Games.update(
            {status: Meteor.userId()},
            {
                $push: {
                    moves: {playerID: Meteor.userId(), move: {positionX: positionX, positionY: positionY}}
                }
            }
        );
    }

    setGameResult(gameId, result) {
        Games.update(
            {_id: gameId},
            {
                $set: {
                    "result": result,
                    "status": GameStatus.END
                }
            }
        );
    }

    updateTurn(game) {
        let nextPlayer;

        if (game.player1 === Meteor.userId())
            nextPlayer = game.player2;
        else
            nextPlayer = game.player1;

        Games.update(
            {status: Meteor.userId()},
            {
                $set: {
                    "status": nextPlayer
                }
            }
        );
    }

    checkIfGameWasWon(x, y) {
        const game = Games.findOne({status: Meteor.userId()});
        const wins = WinRules;
        let winCounter = game.winCounter;

        for (let i = 0; i < winCounter.length; i++) {
            if (winCounter[i].playerID === Meteor.userId()) {
                for (let j = 0; j < wins.length; j++) {
                    for (let k = 0; k < Constants.WINS_COUNT; k++) {
                        if (wins[j][k].positionX == x && wins[j][k].positionY == y) {
                            winCounter[i].winCounts[j]++;
                            break;
                        }
                    }
                }
                Games.update(
                    {_id: game._id},
                    {
                        $set: {
                            "winCounter": winCounter
                        }
                    }
                );
                for (let j = 0; j < winCounter[i].winCounts.length; j++) {
                    if (winCounter[i].winCounts[j] === Constants.WINS_COUNT)
                        return true;
                }
                break;
            }
        }

        return false;
    }

    checkIfGameWasWonNew() {
        const game = Games.findOne({status: Meteor.userId()});
        const myMoves = game.moves;

        for (let i = 0; i < myMoves.length; i++) {
            if (myMoves[i].playerID === Meteor.userId()) {
                for (let j = 0; j < myMoves.length; j++) {
                    if (myMoves[j].playerID === Meteor.userId() &&
                        (myMoves[i].move.positionX !== myMoves[j].move.positionX ||
                            myMoves[i].move.positionY !== myMoves[j].move.positionY)) {
                        console.log("diff");
                    }
                }
            }
        }
        return false;
    }

    removeGame(gameId) {
        Games.remove({_id: gameId});
    }

    removePlayer(gameId, player) {
        Games.update({_id: gameId}, {$set: {[player]: ""}});
    }
}

export const gameLogic = new GameLogic();