import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Constants, GameStatus} from '../../lib/constants';
import {Games} from '../../lib/collections';

Template.board.helpers({
    sideLength: () => {
        let side = new Array(Constants.BOARD_LENGTH);
        side.fill(0);

        return side;
    },

    isMarked: (x, y) => {
        if (Session.get("inGame")) {
            let myGame = Games.findOne({
                $and: [{status: {$ne: GameStatus.WAITING}},
                    {$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}]
            });

            if (myGame !== undefined) {
                if (myGame.moves !== undefined && myGame.moves.length) {
                    for (let i = 0; i < myGame.moves.length; i++) {
                        let myGameMoves = myGame.moves[i];
                        if (myGameMoves.move.positionX == x && myGameMoves.move.positionY == y) {
                            if (myGameMoves.playerID === Meteor.userId()) {
                                return "<p class='mark animated out'>X</p>";
                            }
                            else {
                                return "<p class='mark animated out'>O</p>";
                            }
                        }
                    }
                }
                if (myGame.status === Meteor.userId()) {
                    return "<div class='selectableField' x='" + x + "' y='" + y + "'></div>";
                }
            }
        }
    }
    ,
    active: () => {
        return Session.get("inGame") ? "active" : "in-active";
    }
});

Template.board.events({
    "click .selectableField": (event) => {
        Meteor.call("games.makeMove", event.target.getAttribute('x'), event.target.getAttribute('y'));
    }
});