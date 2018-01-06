import {Constants, GameStatus} from "../lib/constants";
import {Games} from "../lib/collections";
import {getAllWinRules, getMoveCounts} from "./helper";

WinRules = getAllWinRules();
MoveCounts = getMoveCounts(WinRules);

class GameLogic {
    newGame() {
        if (!this.userIsAlreadyPlaying()) {
            Games.insert({
                player1: Meteor.userId(),
                player2: "",
                moves: [],
                status: GameStatus.WAITING,
                result: "",
                moveCounter: [{"playerID": Meteor.userId(), "moveCounts": MoveCounts}]
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
                        status: game.player1,
                    },
                    $push: {
                        moveCounter: {playerID: Meteor.userId(), moveCounts: MoveCounts}
                    }
                }
            );
        }
    }

    validatePosition(positionX, positionY) {
        if (!isNaN(positionX) && !isNaN(positionY) &&
            parseInt(positionX) >= 0 && parseInt(positionY) >= 0 &&
            parseInt(positionX) < Constants.BOARD_LENGTH && parseInt(positionY) < Constants.BOARD_LENGTH) {
            return true;
        }

        throw new Meteor.Error('invalid-position', "Invalid position selected!");
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
        let moveCounter = game.moveCounter;
        for (let i = 0; i < moveCounter.length; i++) {
            if (moveCounter[i].playerID === Meteor.userId()) {
                for (let j = 0; j < wins.length; j++) {
                    for (let k = 0; k < Constants.WINS_COUNT; k++) {
                        if (wins[j][k].positionX == x && wins[j][k].positionY == y) {
                            moveCounter[i].moveCounts[j]++;
                            break;
                        }
                    }
                }
                Games.update(
                    {_id: game._id},
                    {
                        $set: {
                            "moveCounter": moveCounter
                        }
                    }
                );

                for (let j = 0; j < moveCounter[i].moveCounts.length; j++) {
                    if (moveCounter[i].moveCounts[j] === Constants.WINS_COUNT) {
                        return true;
                    }
                }
                break;
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

    hint(game, player) {
        let moveCounter = game.moveCounter;
        let hintMove = [];
        for (let i = 0; i < moveCounter.length; i++) {
            if (moveCounter[i].playerID === player) {
                let moveCounts = moveCounter[i].moveCounts;
                let maxMoves = Math.max.apply(null, moveCounts);
                for (let j = 0; j < moveCounts.length; j++) {
                    if (moveCounts[j] === maxMoves) {
                        for (let k = 0; k < WinRules[j].length; k++) {
                            let playerMoves = game.moves;
                            for (let h = 0; h < playerMoves.length; h++) {
                                if (playerMoves[h].playerID === player &&
                                    (playerMoves[h].move.positionX != WinRules[j][k].positionX ||
                                        playerMoves[h].move.positionY != WinRules[j][k].positionY)) {
                                    if (this.checkNearby(playerMoves[h].move, WinRules[j][k])) {
                                        let checkExist = this.checkExistMove(WinRules[j][k], playerMoves);
                                        if (!checkExist &&
                                            hintMove.findIndex(t => t.positionX == WinRules[j][k].positionX &&
                                                t.positionY == WinRules[j][k].positionY) < 0) {
                                            hintMove.push(WinRules[j][k]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return hintMove;
    }

    checkNearby(move, comparedMove) {
        return (move.positionX == comparedMove.positionX && (move.positionY == comparedMove.positionY - 1) || (move.positionY == comparedMove.positionY + 1))
            || (move.positionY == comparedMove.positionY && (move.positionX == comparedMove.positionX - 1) || (move.positionX == comparedMove.positionX + 1))
            || (move.positionX == comparedMove.positionX - 1 && (move.positionY == comparedMove.positionY + 1 || move.positionY == comparedMove.positionY - 1))
            || (move.positionX == comparedMove.positionX + 1 && (move.positionY == comparedMove.positionY + 1 || move.positionY == comparedMove.positionY - 1))

            || (move.positionY == comparedMove.positionY && (move.positionX == comparedMove.positionX - 1) || (move.positionX == comparedMove.positionX + 1))
            || (move.positionX == comparedMove.positionX && (move.positionY == comparedMove.positionY - 1) || (move.positionY == comparedMove.positionY + 1))
            || (move.positionY == comparedMove.positionY - 1 && (move.positionX == comparedMove.positionX + 1 || move.positionX == comparedMove.positionX - 1))
            || (move.positionY == comparedMove.positionY + 1 && (move.positionX == comparedMove.positionX + 1 || move.positionX == comparedMove.positionX - 1));

    }

    checkExistMove(winRule, playerMoves) {
        for (let i = 0; i < playerMoves.length; i++) {
            if (winRule.positionX == playerMoves[i].positionX &&
                winRule.positionY == playerMoves[i].positionY)
                return true;
        }
        return false;
    }
}

export const gameLogic = new GameLogic();