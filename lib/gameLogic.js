import {Constants, GameStatus} from "../lib/constants";
import {Games} from "../lib/collections";

class GameLogic {
    newGame() {
        if (!this.userIsAlreadyPlaying()) {
            Games.insert({
                player1: Meteor.userId(),
                player2: "",
                moves: [],
                status: GameStatus.WAITING,
                result: ""
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
                        "player2": Meteor.userId(),
                        "status": game.player1
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

    checkIfGameWasWon() {
        const game = Games.findOne({status: Meteor.userId()});

        const wins = [];

        for (let i = 0; i < Constants.BOARD_LENGTH; i++) {
            //horizontal rules
            for (let j = 0; j < Constants.BOARD_LENGTH; j++) {
                let match = [];
                for (let k = i; k < Constants.WINS_COUNT + i; k++) {
                    match.push({positionX: j, positionY: k});
                }
                wins.push(match);
            }
            //vertical rules
            for (let j = 0; j < Constants.BOARD_LENGTH; j++) {
                let match = [];
                for (let k = i; k < Constants.WINS_COUNT + i; k++) {
                    match.push({positionX: k, positionY: j});
                }
                wins.push(match);
            }
        }

        let winCounts = [];

        for (let i = 0; i < wins.length; i++) {
            winCounts.push(0);
        }

        for (let i = 0; i < game.moves.length; i++) {
            if (game.moves[i].playerID === Meteor.userId()) {
                const move = game.moves[i].move;
                for (let j = 0; j < wins.length; j++) {
                    for (let k = 0; k < Constants.WINS_COUNT; k++) {
                        if (wins[j][k].positionX == move.positionX && wins[j][k].positionY == move.positionY) {
                            winCounts[j]++;
                            break;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < winCounts.length; i++) {
            if (winCounts[i] === Constants.WINS_COUNT)
                return true;
        }

        return false;
    }

    checkIfGameWasWonNew() {
        const game = Games.findOne({status: Meteor.userId()});
        const myMoves = game.moves.find({playerID: Meteor.userId()});

        for (let i = 0; i < myMoves.length; i++) {
            if (game.moves[i].playerID === Meteor.userId()){
                for (let j = 0; i < myMoves.length; j++){
                    if (game.moves[j].playerID === Meteor.userId() && (myMoves[i].positionX != myMoves[j].positionX || myMoves[i].positionY != myMoves[j].positionY)){
                        console.log("yes");
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